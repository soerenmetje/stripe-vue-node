import express from "express";
import Stripe from "stripe";

import {STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET} from "../config.js"

const stripe = Stripe(STRIPE_SECRET_KEY);
const router = express.Router();

router.post(
    '/',
    express.raw({type: 'application/json'}),
    (request, response) => {
        let event = request.body;
        // Get the signature sent by Stripe
        const signature = request.headers['stripe-signature'];
        try {
            event = stripe.webhooks.constructEvent(
                request.body,
                signature,
                STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.log(`Webhook signature verification failed.`, err.name, err.message);
            return response.sendStatus(400);
        }

        // Handle the event. See https://stripe.com/docs/api/events/types
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object
                console.log(`Stripe checkout session '${session.id}' status is '${session.status}'`)

                console.debug(session)

                const customerId = session.customer
                let discordId = session.metadata.discordId // checkouts originating from dashboard have a discordId
                if (!discordId) { // checkouts coming from other sources (f.e. manually created payment links) must ask the user to set his/her discordId manually.
                    // To do so, in Stripe the checkout page of the payment link have to include a custom field for the discordId
                    const cfDiscordId = session.custom_fields.find(e => e.key === "discordId")
                    if (cfDiscordId) {
                        discordId = cfDiscordId.text.value
                    }
                }
                if (!discordId) {
                    console.warn(`Warn: DiscordId not found in custom_fields or metadata. If the user is not already a customer, his/her Stripe customerId '${customerId}' has to be manually added to the Hawk dash user!`)
                    console.log("custom_fields:", session.custom_fields)
                    console.log("metadata:", session.metadata)
                } else {
                    console.log(`Stripe CustomerId=${customerId} DiscordId=${discordId}`)

                    // TODO Update user with DiscordId in DB: set customerId
                }


                break
            }
            case 'customer.deleted': {

                const customer = event.data.object
                //TODO Find user with customerId in DB and remove the customerId
                break
            }
            default: {
                // Unexpected event type
                // console.log(`Unhandled event type ${event.type}.`);
            }
        }
        // Return a 200 response to acknowledge receipt of the event
        response.send();
    }
);

export default router;
