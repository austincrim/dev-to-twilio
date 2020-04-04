require("dotenv").config();

const client = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

export default (body, toNumber) => {
  client.messages
    .create({
      body,
      from: "+12029528194",
      to: toNumber
    })
    .then(message => console.log(message.sid));
};