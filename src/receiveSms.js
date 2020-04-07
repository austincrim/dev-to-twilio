const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const recipeClient = require('./recipeClient');

const app = express();
const PORT = process.env.PORT || 1337;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
    })
);

app.post('/sms', async (req, res) => {
    const twimlResponse = new MessagingResponse();
    let ingredients, offset = 0;

    if (req.body.Body.toLowerCase() === 'next') {
        if (req.session.ingredients) {
            ingredients = req.session.ingredients;
            req.session.offset += 3;
            offset = req.session.offset;
        }
    } else {
        ingredients = req.body.Body;
        req.session.ingredients = req.body.Body;
        req.session.offset = 0;
    }
    console.info(`Ingredients: ${ingredients}`);
    console.info(`Offset: ${offset}`);

    try {
        const recipeIds = await recipeClient.getRecipeIdsByIngredients(
            ingredients,
            offset
        );
        const recipeDetails = await recipeClient.getRecipeDetailsByIds(
            recipeIds
        );
        recipeDetails.forEach((r) => {
            const message = twimlResponse.message();
            message.body(`\n${r.title}\n${r.sourceUrl}`);
            message.media(r.image);
        });
    } catch (error) {
        console.error(error.message);
        message = `Woops! Looks like we had some trouble with that request.\nEnsure that you send a list of ingredients separated by commas (e.g. carrots, rice, chicken).`;
    }

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twimlResponse.toString());
});

app.listen(PORT, () => {
    console.log(`Express server listening on ${PORT}`);
});
