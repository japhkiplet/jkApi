import sql from 'mssql';
import config from '../data/config.js';




const pool = new sql.ConnectionPool(config.sql);
await pool.connect();

//getting all products
export const getAllProducts = async (req, res) => {
  try {
    let pool = await sql.connect(config.sql);
    const persons = await pool.request()
    .query("SELECT * FROM Products");
    res.status(200).json(persons.recordset);
  } catch (error) {
    res.status(201).json( error);
  } finally {
    sql.close();
  }
};

const checkProductIdExists = async (ProductID) => {
  // returns true if a number exists and false if it doesn't
  try {
    const user = await pool
      .request()
      .input("ProductID", sql.Int, ProductID)
      .query("SELECT * FROM Products WHERE ProductID = @ProductID");
    console.log(user.recordset);
    if (user.recordset.length == 0) {
      return false;
    } else {
      return true;
    }
  } finally {
    sql.close();
  }
};

console.log(await checkProductIdExists("1"));



//creating a new product
export const createProduct = async (req, res) => {
 

  try {
    const { Title, Category, Price, Description, ImageURL } = req.body;
   
    await pool
      .request()
      .input('Title', sql.VarChar, Title)
      .input('Category', sql.VarChar, Category)
      .input('Price', sql.VarChar, Price)
      .input('Description', sql.Text, Description)
      .input('ImageURL', sql.VarChar, ImageURL)
      .query(
        'INSERT INTO Products(Title,Category, Price, Description,ImageURL) VALUES (@Title,@Category, @Price, @Description, @ImageURL)'
      );
    res.status(200).json({ message: 'product created successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  } finally {
    sql.close();
  }
};

//get a product
export const getProduct = async (req, res) => {
    try {
        const { Title } = req.params;
        let pool = await sql.connect(config.sql)
        const result = await pool.request()
            .input('Title', sql.VarChar, Title)
            .query("select * from Products where Title = @Title")
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({message: error.message});
    } finally {
        sql.close()
    }

}

// update a product details
export const updateProduct = async (req, res) => {
    try {
        const {  Title,Category,Price,ImageURL } = req.params;
        let pool = await sql.connect(config.sql)
         await pool.request()
            .input('Title', sql.VarChar, Title)
            .input('Category', sql.VarChar, Category)
            .input('Price', sql.VarChar, Price)
            .input('ImageURL', sql.VarChar, ImageURL)
            .query("update Products set Title=@Title, Category=@Category, Price=@Price, ImageURL=@ImageURL where Title=@Title")
        res.status(200).json({ message: 'product updated successfully' })
    } catch (error) {
        res.status(200).json(error);

    }finally{
        sql.close()
    }
}

//delete  product
export const deleteProduct = async (req, res) => {
    try {
        const {  Title } = req.params;
        let pool = await sql.connect(config.sql)
        await pool.request()         
            .query(`delete from Products where Title = ${Title}`)
        res.status(200).json({ message: 'product deleted successfully' })
    } catch (error) {
        res.status(200).json(error);

    }finally{
        sql.close()
    }
}