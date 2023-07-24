import sql from 'mssql';
import config from '../data/config.js';




const pool = new sql.ConnectionPool(config.sql);
await pool.connect();

//getting all orders
export const getAllOrders = async (req, res) => {
  try {
    let pool = await sql.connect(config.sql);
    const persons = await pool.request()
    .query("SELECT * FROM orders");
    res.status(200).json(persons.recordset);
  } catch (error) {
    res.status(201).json( error);
  } finally {
    sql.close();
  }
};
