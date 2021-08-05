"use strict";

require("dotenv").config();

import { start } from "./server";
const port = process.env.PORT || 3000;

/** Starts the server. */
start({
    port: port
}).then(app => {
    console.log("[node] Application is now running on port " + port);
})