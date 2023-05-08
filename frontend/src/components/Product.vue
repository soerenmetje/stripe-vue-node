<template>


    <div style="display: flex; justify-content: center; margin: 20px;">
        <span style="margin-right: 10px; margin-left: 10px;">{{ price.product.name }} </span>
        <span style="margin-left: 10px; margin-right: 10px;">{{ price.unit_amount / 100 }} € </span>

        <form action="http://localhost:4242/subscriptions/checkout" method="POST">
            <input type="hidden" name="priceId" :value="price.id"/>
            <button id="checkout-and-portal-button" type="submit">
                Buy
            </button>
        </form>
    </div>
</template>

<script>


const axios = require("axios")
export default {
    name: "Product",
    props: [
        "price", "amount", "name"
    ]
}
</script>

<style scoped>

</style>
