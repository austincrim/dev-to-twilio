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
    const twimlResponse = new MessagingResponse();

    try {
        const recipeIds = await recipeClient.getRecipeIdsByIngredients(ingredients);
        const recipeDetails = await recipeClient.getRecipeDetailsByIds(recipeIds);
        recipeDetails.forEach(r => {
            const message = twimlResponse.message();
            message.body(`\n${r.title}\n${r.url}`);
            message.media(r.image); 
        });
    } catch (error) {
        console.error(error.message);
        message = `Woops! Looks like we had some trouble with that request.\nEnsure that you send a list of ingredients separated by commas (e.g. carrots, rice, chicken).`
    }
    
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twimlResponse.toString());
});

app.listen(PORT, () => {
    console.log(`Express server listening on ${PORT}`);
});
