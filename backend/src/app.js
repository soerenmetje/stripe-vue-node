import express from "express";

import {PORT} from './config.js'
import eventsRouter from "./routes/events.js";
import subscriptionsRouter from "./routes/subscriptions.js";

const app = express();


app.use(express.urlencoded({extended: true}));

app.use("/events", eventsRouter)
app.use("/subscriptions", subscriptionsRouter)

const port = PORT || 4242
app.listen(port, () => console.log(`Running on http://localhost:${port}`));
