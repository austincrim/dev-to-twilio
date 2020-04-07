const express = require('express');
const bodyParser = require('body-parser');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const recipeClient = require('./recipeClient');

const app = express();
const PORT = process.env.PORT || 1337;

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/sms', async (req, res) => {
    const twimlResponse = new MessagingResponse();
    const ingredients = req.body.Body;
    console.info(`Ingredients: ${ingredients}`);
    let numberToReturn = 3;

    const lastElementPassed = ingredients.split(',').pop();
    console.log(`last element passed: ${lastElementPassed}`);

    if(!isNaN(lastElementPassed)) {
        numberToReturn = lastElementPassed;
    }

    console.log('numberToReturn', numberToReturn);

    try {
        const recipeIds = await recipeClient.getRecipeIdsByIngredients(
            ingredients, numberToReturn
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
