const path = require("path");
const axios = require('axios');

const fastify = require("fastify")({
    logger: false,
});

// https://t.me/rmsup | @secbaz

// Setup our static files
fastify.register(require("@fastify/static"), {
    root: path.join(__dirname, "public"),
    prefix: "/", // optional: default '/'
});

// Formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// View is a templating manager for fastify
fastify.register(require("@fastify/view"), {
    engine: {
        handlebars: require("handlebars"),
    },
});

// Load and parse SEO data
const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
    seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}


fastify.get("/", function (request, reply) {

    return "404 Page Not found.";
});


fastify.post("/", async function (request, reply) {
    const payload = request.body;
    try {
        const response = await axios.post(`https://api.telegram.org/bot${payload.token}/${payload.method}`, payload.data);
        return response.data;
    } catch (error) {
        return { error: error };
    }

});

// https://t.me/rmsup | @secbaz
fastify.listen(
    { port: process.env.PORT, host: "0.0.0.0" },
    function (err, address) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Your app is listening on ${address}`);
    }
);
