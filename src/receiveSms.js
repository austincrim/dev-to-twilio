const express = require('express');
const bodyParser = require('body-parser');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const recipeClient = require('./recipeClient');

const app = express();
const PORT = process.env.PORT || 1337;

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/sms', async (req, res) => {
    const twimlResponse = new MessagingResponse();
    const inputMessage = req.body.Body;
    const inputArray = inputMessage.split(',');
    let ingredients, numberToReturn = '3';
    console.info(`inputMessage: ${inputMessage}`);

    const lastElementPassed = inputArray.pop();
    console.log(`last element passed: ${lastElementPassed}`);

    if(!isNaN(lastElementPassed)) {
        numberToReturn = lastElementPassed;
        ingredients = inputArray.join();;
    } else {
        ingredients = inputMessage;
    }

    console.log('ingredients', ingredients);
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
        const message = twimlResponse.message();
        message.body(`Woops! Looks like we had some trouble with that request.\nEnsure that you send a list of ingredients separated by commas (e.g. carrots, rice, chicken).`);
    }

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twimlResponse.toString());
});

app.listen(PORT, () => {
    console.log(`Express server listening on ${PORT}`);
});
