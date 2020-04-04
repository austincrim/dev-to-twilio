const express = require("express");
const bodyParser = require("body-parser");
const MessagingResponse = require("twilio").twiml.MessagingResponse;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/sms", (req, res) => {
    const twiml = new MessagingResponse();

    twiml.message(`Hello, ${req.body.Body}!`);

    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
});

app.listen(1337, () => {
    console.log("Express server listening on port 1337");
});
