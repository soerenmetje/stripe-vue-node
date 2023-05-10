import express from "express";
import Stripe from "stripe";

import {STRIPE_SECRET_KEY, FRONTEND_BASE_URL} from "../config.js"


const stripeRedirectUrlSuccess = new URL("/success?sessionId={CHECKOUT_SESSION_ID}", FRONTEND_BASE_URL).toString();
const stripeRedirectUrlCancel = new URL("/", FRONTEND_BASE_URL).toString();
const stripeRedirectUrlError = new URL("/error", FRONTEND_BASE_URL).toString();

const stripe = Stripe(STRIPE_SECRET_KEY); // tested with apiVersion: '2022-11-15'
const router = express.Router();

router.use(express.json())

router.get('/prices', async (req, res) => {
    const allPrices = []
    // handles pagination. See https://stripe.com/docs/api/pagination/auto
    for await (const price of stripe.prices.list({expand: ['data.product']})) {
        //console.debug(price)
        allPrices.push(price)
    }
    //console.debug(allPrices)
    //console.debug(`Number of prices: ${allPrices.length}`)

    res.json(allPrices)
})

router.post('/checkout', async (req, res) => {
    const priceId = req.body.priceId

    try {
        const session = await stripe.checkout.sessions.create({
            billing_address_collection: 'auto',
            line_items: [
                {
                    price: priceId,
                    // For metered billing, do not pass quantity
                    quantity: 1,

                },
            ],
            /*
            custom_fields: [
                {
                    label: {
                        type: 'custom',
                        custom: 'Discord User ID',
                    },
                    key: "discordId",
                    type: "text"
                }
            ],
             */
            metadata: {
                discordId: 123456789 //TODO pass user discordId to enable matching with later created customer id (retrieve discordId from user session)
            },
            // customer: "", //TODO if user is already customer: set customer in checkout
            mode: 'subscription',
            success_url: stripeRedirectUrlSuccess,
            cancel_url: stripeRedirectUrlCancel,
        });

        res.redirect(303, session.url);
    } catch (err) {
        console.error("Fail: Can not create checkout session.", err.name, err.message)
        console.log(err)
        res.redirect(stripeRedirectUrlError)
    }
});

router.post('/portal', async (req, res) => {

    // Typically the customer ID is stored alongside the authenticated user in your database.
    const customerId = "" //TODO get customerID from user DB

    // return_url is the url to which the customer will be redirected when they are done
    // managing their billing with the portal.
    const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: FRONTEND_BASE_URL,
    });

    res.redirect(portalSession.url);
});
export default router;
