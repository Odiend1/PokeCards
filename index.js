const Discord = require("discord.js")
const Webhook = require("discord.js") 
//const fetch = require("node-fetch")
const { Client, Intents, WebhookClient, MessageEmbed, MessageReaction, ApplicationCommand, MessageAttachment } = require('discord.js');
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const botToken = process.env['TOKEN']
const cron = require('cron');
var prefix = ";";
//const Database = require("@replit/database")
//const db = new Database()
const { QuickDB } = require('quick.db');
const db = new QuickDB({filePath: './db.sqlite'})
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('node:fs');
const axios = require('axios');
const apiKey = process.env['API_KEY']
//const fetch = require("node-fetch")
const https = require('node:https')
//const JSON = require
const request = require("request-promise-native");
//var cards = JSON.parse(fs.readFileSync('pokemoncards.json', 'utf8'));

function between(min, max) {
  return Math.floor(
    Math.random() * (max - min) + min
  )
}



async function cardName(id, callback){
 /* axios
    .get(`https://${apiKey}@api.pokemontcg.io/v2/cards?q=id:${id}`)
    .then(res => {
      return res.data.data[0].name;
    }).catch(error => {console.error(error);});*/
  console.log(id)
  /*return fetch(`https://api.pokemontcg.io/v2/cards?q=id:${id}`)
    .then(res => res.json())
    .then(out => {
      if(out.count !== 0) return out.data[0].name;
      else return id;
      console.log(out)})
  */
  let url = `https://api.pokemontcg.io/v2/cards?q=id:${id}`;

/*https.get(url, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var out = JSON.parse(body);
         callback(out);//.data.name;
    });
}).on('error', function(e){
      console.log("Got an error: ", e);
});*/
 // Notice the async keyword here
    try{
        return await request(url); // Notice the await keyword here
    }
    catch(error){
        // Handle any potential errors here
    }

}
(async () => {
let name = await cardName("base1-4")
console.log(name)
})
function cardRarity(id){
  axios.get(`https://${apiKey}@api.pokemontcg.io/v2/cards?q=id:${id}`)
    .then(res => {return res.data.data[0].rarity})
    .catch(error => {console.error(error);});
}


function getUserFromMention(mention) {
    if (!mention) return "Invalid";

    if (mention.startsWith('<@') && mention.endsWith('>')) {
      mention = mention.slice(2, -1);

      if (mention.startsWith('!')) {
        mention = mention.slice(1);
      }

      return client.users.cache.get(mention);
    } 

  }

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`)
  //db.set("703017064675409952_inventory", [""])
})
var http = require('http');  
http.createServer(function (req, res) {   
  res.write("I'm alive");   
  res.end(); 
}).listen(8080);

client.on("message", async msg => {
  if (!msg.content.startsWith(prefix)) return;

    const args = msg.content.trim().split(/ +/g);
    const cmd = args[0].slice(prefix.length).toLowerCase();

    if (msg.author.bot) return;
  if(cmd === "random"){
    try{
      var page = between(1, 62)
      if(args[1]) page = 1;
      console.log(page)
      var nameQuery = "name:";
      if(args[1]) nameQuery = nameQuery + args[1];
      else nameQuery = "";
axios
  .get(`https://${apiKey}@api.pokemontcg.io/v2/cards?page=${page.toString()}&pageSize=250&q=${nameQuery}`)
  .then(res => {
  let selCards = between(0, res.data.data.length);
    //console.log(res.data.data.length)
    //console.log(res.data.data)//.data.data[selCards].small)
  //console.log(res.data.data[selCards].id)
    if(res.data.count !== 0) msg.reply({/*content: res.data.data[selCards].name, */files: [new MessageAttachment(res.data.data[selCards].images.large)]})
      else msg.reply("No card with that name was found.")
    //console.log(`${res.data.data.name}`);
    //console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
    }
    catch(e){
      console.log(e)
      msg.reply("Sorry, something went wrong. Please try again later.")
    }
  }
  if(cmd === "energy"){
    try{
      let page = 1
axios
  .get(`https://${apiKey}@api.pokemontcg.io/v2/cards?q=supertype:energy%20subtypes:basic`)
  .then(res => {
  let selCards = between(0, res.data.data.length);
    //console.log(res.data.data.length)
    //console.log(res.data.data)//.data.data[selCards].small)
  if(res.data.count !== 0) msg.reply({/*content: res.data.data[selCards].name, */files: [new MessageAttachment(res.data.data[selCards].images.large)]})
      else msg.reply("No card with that name was found.")
    //console.log(`${res.data.data.name}`);
    //console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
    }
    catch(e){
      console.log(e)
      msg.reply("Sorry, something went wrong. Please try again later.")
    }
  }
  if(cmd === "channel"){
    if(msg.member.permissions.has("MANAGE_GUILD")){
      if(!args[1]){
      try{
      db.set(msg.guild.id +"_channel", msg.channel.id)
        msg.reply(`The card drop channel has been set to <#${msg.channel.id}>!`)
      }
      catch(e){
        console.log(e)
        msg.reply("Sorry, something went wrong. Please try again later.")
      }
      }
      else if(args[1]){
        msg.reply("Use the `channel` command in the channel you want to have card drops in.")
      }
    }
    else{
      msg.reply("You do not have permission to perform that action!\n\nPermissions Needed: `MANAGE_SERVER`")
    }
  }
  /*if (cmd === "inventory" || cmd === "i") {
      db.get(msg.author.id + "_inventory").then(async value => {
        if(value !== null) var iNum = value.length;
        else var iNum = 0;
        var iList = "";
        var iIn = new Array();
        var iInCount = new Array();

        var cardCount = 0;
        while (iNum > 0 && cardCount < 1) {
          var arrayNum = iNum - 1;
          if (value[arrayNum] === " " || value[arrayNum] === "" || value[arrayNum] === null) {
            iNum--;
          }
          else {
            var count = 0;
            if (!!iIn.includes(value[arrayNum])) {

            }
            else {
              msg.reply("Retrieving card #" + (cardCount + 1))
              iIn = iIn.concat([value[arrayNum]])
              var index = iIn.indexOf(value[arrayNum]);
              //var corr = iInCount[index]
              value.forEach(element => {
                if (element === value[arrayNum]) {
                  count++;
                }
              })
              if(typeof value[arrayNum] === 'string') var name = value[arrayNum];
              else var name = value[arrayNum].name;
              //axios
    //.get(`https://${apiKey}@api.pokemontcg.io/v2/cards?q=id:` + value[arrayNum])//name)
    //.then(res => {
    fs.readFile('pokemoncards.json', 'utf8', function (err, data) {
      if (err) throw err;
      cards = JSON.parse(data); // NOTE: YOU HAVE A CARD OBJECT ALREADY INITIALIZED, SO DO NOT UNCOMMENT
      var card = cards.find(card => card.id === value[arrayNum]);
       name = card.name
      iList = `${iList}\n${name} x${count}`;
      while(Promise.resolve(iList) == iList){
        continue;
      }
      msg.reply(iList);
    })
              
              iInCount[index] = count
            
            }
            iNum--;
          }
          cardCount++;
        }
        //}
       // const iEmbed = new MessageEmbed()
        //  .setColor("#ffff00")
  //.setTitle(`${getUserFromMention(`<@${msg.author.id}>`).username}'s Inventory`)
        //  .setDescription(iList)
       // msg.reply({ embeds: [iEmbed] })
        //console.log(iList)
        
        
        
      })
    }*/
  if(cmd === "c" || cmd === "claim"){
    db.get(msg.guild.id + "_spawn").then(async value => {
      if(value !== "" && value !== null){
        var spawn = value
        let spawnId = ""
  for (let i = 0; i < spawn.length; i++) {
    if (spawn[i] !== '"') {
      spawnId += spawn[i]
    }
  }
        spawn = spawnId;
        db.get(msg.author.id + "_inventory").then(async value => {
          /*if(value !== null) var newI = value.concat([spawn])
          else var newI = ["", spawn]
          db.set(msg.author.id + "_inventory", newI)*/
          if(value !== null) db.push(msg.author.id + "_inventory", spawn)
          else db.set(msg.author.id + "_inventory", [spawn])
          db.set(msg.guild.id + "_spawn", "")

          axios
    .get(`https://${apiKey}@api.pokemontcg.io/v2/cards?q=id:` + spawn)
    .then(res => {

      var name = res.data.data[0].name;

      axios.get(`https://${apiKey}@api.pokemontcg.io/v2/cards?q=id:${spawn}`)
    .then(res => {
      var rarity = res.data.data[0].rarity
      let a = "a";
      if(rarity === "Uncommon" || rarity === "Amazing Rare") a = "an"
          msg.reply(`<@${msg.author.id}> claimed ${a} ${rarity} ${name}!`)
              })
    .catch(error => {console.error(error);});
          }).catch(error => {console.error(error);});
        })
      }
      else msg.reply("There's nothing to claim!")
    })
  }
});

client.on("message", async msg => {
  try{

  db.get(msg.guild.id + "_spawnCnt").then(async value => {
    //msg.reply((value + 1).toString())
    if(value === null){
      db.set(msg.guild.id + "_spawnCnt", 0)
    }
    else{
      db.set(msg.guild.id + "_spawnCnt", value + 1)
    }
    if(value === 24){
          db.set(msg.guild.id + "_spawnCnt", 0)
      db.get(msg.guild.id + "_channel").then(async value => {
        try{
      var page = between(1, 72)
      console.log(page)
axios
  .get(`https://${apiKey}@api.pokemontcg.io/v2/cards?page=${page.toString()}&pageSize=250`)
  .then(res => {
  let selCards = between(0, res.data.data.length);
  client.guilds.cache.get(msg.guild.id).channels.cache.get(value).send({embeds: [new MessageEmbed().setTitle("A card spawned!").setColor("#ffff00").setDescription("Use ;claim to claim it!").setImage(res.data.data[selCards].images.large)]})
    let spawn = res.data.data[selCards].id
    let spawnId = ""
  for (let i = 0; i < spawn.length; i++) {
    if (spawn[i] !== '"') {
      spawnId += spawn[i]
    }
  }
    db.set(msg.guild.id + "_spawn", spawnId)
    console.log(spawnId)//res.data.data[selCards].id)
  })
  .catch(error => {
    console.error(error);
  });
    }
    catch(e){
      console.log(e)
      msg.reply("Sorry, something went wrong. Please try again later.")
    }
      })
    }
    else if (value > 24){
      db.set(msg.guild.id + "_spawnCnt", 0)
    }
  })
  }
  catch(e){
    console.log(e)
  }
})

client.login(botToken);