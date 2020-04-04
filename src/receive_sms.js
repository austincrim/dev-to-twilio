const express = require("express");
const bodyParser = require("body-parser");
const MessagingResponse = require("twilio").twiml.MessagingResponse;

const recipeClient = require('./recipeClient');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/sms", async (req, res) => {
    const ingredients = req.body.Body;

    const recipeIds = await recipeClient.getRecipeIdsByIngredients(ingredients);
    const recipeDetails = await recipeClient.getRecipeDetailsByIds(recipeIds);
    const recipeResponseData = recipeDetails.map(r => {
        return {url: r.sourceUrl, title: r.title}
    });

    const responseStrings = recipeResponseData.map(r => `Title: ${r.title}\nLink: ${r.url}\n\n`);

    const twiml = new MessagingResponse();

    twiml.message(`Here are your recipes!\n\n${responseStrings.map(s => s).join('')}`);

    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
});

app.listen(1337, () => {
    console.log("Express server listening on port 1337");
});
