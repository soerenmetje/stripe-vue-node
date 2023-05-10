# Stripe-CLI

Test your Stripe Webhooks locally using Stripe-CLI in a Docker container.


Run the interactive container:
```shell
docker run --name stripe-testing --rm -it -v stripe-testing-config://root/.config/stripe/ --net=host --entrypoint=/bin/sh stripe/stripe-cli:v1.14.1 
```

In container, login first:
```shell
stripe login
```

Then, forward events to a local webhook endpoint:
```shell
stripe listen --forward-to localhost:4242/events
```
Insert the printed webhook secret `whsec_e5d6836a1...` into your app config.


Trigger events to test your webhooks integration by running following command outside of the container:
```shell
docker exec stripe-testing stripe trigger checkout.session.completed
```

## Sources

- https://stripe.com/docs/stripe-cli
- https://github.com/stripe/stripe-cli
