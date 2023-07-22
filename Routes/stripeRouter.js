import express from 'express'
import {createCheckoutSession,  webhookHandler } from '../contollers/stripeController.js';


const routes = (app) => {
    app.route('/create-checkout-session')
     .post( createCheckoutSession);
    
     app.route('/webhook').post( express.raw({ type: 'application/json' }), webhookHandler)  

};
export default routes;