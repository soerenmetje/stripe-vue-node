// Config
// This module serves runtime parameter to this application.
//
// The parameters can be set via
// 1. environment variables (production)
// 2. in .env.local file (development)


import dotenv from "dotenv";

const result = dotenv.config({path: '.env.local'});

if (result.error) {
    console.log("No .env.local file found! Using Env variables directly")
}
const PORT = process.env["PORT"];
const BACKEND_BASE_URL = process.env["BACKEND_BASE_URL"];
const FRONTEND_BASE_URL = process.env["FRONTEND_BASE_URL"];
const STRIPE_SECRET_KEY = process.env["STRIPE_SECRET_KEY"];
const STRIPE_WEBHOOK_SECRET = process.env["STRIPE_WEBHOOK_SECRET"];


//console.log("Config = ", envs);

if (!FRONTEND_BASE_URL) {
    console.error("FRONTEND_BASE_URL not set in config");
    process.exit(1);
}
if (!BACKEND_BASE_URL) {
    console.error("BACKEND_BASE_URL not set in config");
    process.exit(1);
}

if (!STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY not set in config");
    process.exit(1);
}

if (!STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET not set in config");
    process.exit(1);
}

// PORT is optional

export {
    PORT,
    BACKEND_BASE_URL,
    FRONTEND_BASE_URL,
    STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET,
};
