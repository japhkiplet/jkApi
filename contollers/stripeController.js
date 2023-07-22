import Stripe from 'stripe';
import sql from 'mssql'
import config from '../data/config.js';



const stripe = Stripe('sk_test_51NQ81rDlvDgH0PxjtljatgvosAsncKPHShLjgIFiekZ6URN37RGSs9H3ziEOZvXudTzWtPC2nPCkXTofKWJEoQbf00rJUrZuIp');
const client = 'http://localhost:5173'

export const createCheckoutSession = async (req, res) => {
  const customer = await stripe.customers.create({
    metadata: {
      userID : req.body.userID,
      cart: JSON.stringify(req.body.cartItems),
    }
  })
      const line_items = req.body.cartItems.map((item)=>{
        return{
          
          price_data:{
            currency:'usd',
            product_data: {
              name: item.Title,
              images: [item.ImageURL],
              description: item.Description,
              metadata: {
                id: item.ProductID
              }
            },
            unit_amount: item.Price 
          },
          quantity: item.cartTotalquantity
        }
      });
      
    

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "KE"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "usd",
            },
            display_name: "Next day air",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      customer: customer.id,
      line_items,
      mode: "payment",
      success_url: `${client}/checkout`,
      cancel_url: `${client}/cart`,
      
    });

    res.send({ url: session.url });
  } 
 

  const createOrder = async (customer, data) => {
    try {
      const item = JSON.parse(customer.metadata.cart);
      console.log(item)
      const pool = await sql.connect(config.sql);
      const order = await pool
        .request()
        .input('userId', sql.Int, customer.metadata.user_id)
        .input('paymentIntent', sql.VarChar(), data.payment_intent)
        .input('productName', sql.VarChar(), item[0].Title)
        .input('productID', sql.Int, item[0].ProductID        )
        .input('quantity', sql.Int, item[0].cartTotalquantity)
        .input('shippingAddress', sql.VarChar(), data.customer_details.address.country)
        .input('totalAmount', sql.Int, data.amount_total/100)
        .query('INSERT INTO orders (userID, productName, quantity, shippingAddress,totalAmount, paymentIntent) VALUES (@userID, @productName, @quantity, @shippingAddress, @totalAmount, @paymentIntent)');
  
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };
  //webhooks
// This is your Stripe CLI webhook secret for testing your endpoint locally.
let endpointSecret;
// endpointSecret = "whsec_113d78c5575576a5ad51e213337c7b108083c7039052f6f737ebe0689bc7cbc0";
 
export const webhookHandler = (request, response) => {
  const sig = request.headers['stripe-signature'];

  let data;
  let eventType;
  if(endpointSecret){

    let event;
  
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log('verification success')
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      console.log(err)
      return;
    }
  }else{
    data = request.body.data.object;
    eventType = request.body.type;
  }

  // Handle the event
   if(eventType === "checkout.session.completed"){
    stripe.customers.retrieve(data.customer).then(
      (customer)=>{
        // const item = JSON.parse(customer.metadata.cart)
        // console.log(...item)
        // console.log(item[0].name)
        createOrder(customer, data)
        // console.log(data)
        // console.log(customer)
      }
    ).catch(err=> console.log(err.message))
   }


  // Return a 200 response to acknowledge receipt of the event
  response.send().end();
};




