
import { getAllOrders } from "../contollers/Order.js";
// import { isAdmin } from "../contollers/middleware.js";
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "../contollers/product.js";



const routes = (app) => {
    app.route('/product')
        .get( getAllProducts)
        .post( createProduct );
    
        app.route('/product/:Title')
        .get(getProduct)
        .put(updateProduct)
        .delete(deleteProduct);

    

        app.route('/order')
            .get(getAllOrders);

  


};
export default routes;