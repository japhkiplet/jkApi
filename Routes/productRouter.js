
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "../contollers/product.js";



const routes = (app) => {
    app.route('/product')
        .get( getAllProducts)
        .post( createProduct );
    
        app.route('/product/:Title')
        .get(getProduct)
        .put(updateProduct)
        .delete(deleteProduct);

    

        


  


};
export default routes;