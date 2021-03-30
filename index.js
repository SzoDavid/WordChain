require('dotenv').config();

const prefix = "wc!";

const Discord = require('discord.js');
const client = new Discord.Client();

client.login(process.env.BOT_TOKEN);

client.on('ready', botReady);
client.on('message', gotMessage)

/* EVENT HANDLERS */

function botReady() {
    console.log("Bot is ready!");
}

function gotMessage(msg) {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
    	msg.channel.send('Pong.');
    } else if (command === 'beep') {
    	msg.channel.send('Boop.');
    }
}
