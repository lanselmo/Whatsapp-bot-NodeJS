// Supports ES6
// import { create, Whatsapp } from 'sulla';
// const bot = require("venom-bot");
const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { db } = require("../src/models/banco");
const { step } = require("../src/models/stages");

const client = new Client();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});
client.on("ready", () => {
  console.log("Client is ready! conectando");
});


/*client.on("message", (message) => {
  message
} );*/


client.on("message", (message) => {

  const { body, notifyName, id } = message.data;
  let resp = step[getStage(message.from)].obj.execute(

    body,
    notifyName,
    id
    
    //message.from,
    //message.body,
    //message.sender.name

    //client.sendMessage(message.from, "oi, manow");

  );

  for (let index = 0; index < resp.length; index++) {
    const element = resp[index];
    client.sendText(message.from, element);
  }
});



function getStage(user) {
  if (db[user]) {
    //Se existir esse numero no banco de dados
    return db[user].stage;
  } else {
    //Se for a primeira vez que entra e contato
    db[user] = {
      stage: 0,
      itens: [],
    };
    return db[user].stage;
  }
}

client
  .initialize()
  .then((client) => {
    console.log("has new client");
  })
  .catch((err) => console.log(err));
