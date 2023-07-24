import express from 'express'
import {createCheckoutSession,  webhookHandler } from '../contollers/stripeController.js';


const routes = (app) => {
    app.route('/create-checkout-session')
     .post( createCheckoutSession);
    
     app.route('/stripe_webhooks').post(webhookHandler, express.raw({ type: 'application/json' }))  

};
export default routes;