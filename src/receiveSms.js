const express = require("express");
const bodyParser = require("body-parser");
const MessagingResponse = require("twilio").twiml.MessagingResponse;

const recipeClient = require('./recipeClient');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
const PORT = process.env.PORT || 1337;

app.post("/sms", async (req, res) => {
    const ingredients = req.body.Body;
    console.info(`Ingredients: ${ingredients}`);
    let message

    try {
        const recipeIds = await recipeClient.getRecipeIdsByIngredients(ingredients);
        const recipeDetails = await recipeClient.getRecipeDetailsByIds(recipeIds);
        const recipeResponseData = recipeDetails.map(r => {
            return {url: r.sourceUrl, title: r.title}
        });
        const responseStrings = recipeResponseData.map(r => `${r.title}\n${r.url}\n\n`);
        message = `Here are your recipes!\n\n${responseStrings.map(s => s).join('')}`; 
    } catch (error) {
        console.error(error);
        message = `Woops! Looks like we had some trouble with that request.\nEnsure that you send a list of ingredients separated by commas (e.g. carrots, rice, chicken).`
    }
    
    const twiml = new MessagingResponse();
    twiml.message(message);

    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
});

app.listen(PORT, () => {
    console.log(`Express server listening on ${PORT}`);
});
