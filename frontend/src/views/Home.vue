<template>
    <div class="home">
        <div style="padding: 15px;">
            <h2>User Portal</h2>

            <form action="http://localhost:4242/subscriptions/portal" method="POST">
                <input type="hidden" name="sessionId" :value="this.sessionId"/>
                <button id="checkout-and-portal-button" type="submit">
                    My Stripe User Portal
                </button>
            </form>
        </div>
        <div style="padding: 15px;">
            <h2>Products</h2>
            <Product v-for="p in prices" :price="p" :name="p.product.name" amount="1999"/>
            <div v-if="!prices.length">
                No products available or loading...
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import Product from "@/components/Product";
import axios from "axios";

export default {
    name: 'Home',
    components: {
        Product,
    },
    data() {
        return {
            prices: [],
            sessionId: ""
        }
    },

    mounted() {
        axios.get("http://localhost:4242/subscriptions/prices").then((res) => {
            this.prices = res.data
        })
    }
}
</script>
