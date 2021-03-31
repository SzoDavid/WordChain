require('dotenv').config();

const prefix = process.env.PREFIX;
const ignore_prefix = process.env.IGNORE_PREFIX;

const Keyv = require('keyv');
const data = new Keyv();    //('mysql://user:pass@localhost:3306/dbname');

const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

client.login(process.env.BOT_TOKEN);

/* EVENT HANDLERS */

client.on('ready', async () => {
    await data.set('status', 'ready');
    await data.set('channel', ' ');
    console.log("Bot is ready!");
});

client.on('message', async msg => {
    const channel = await data.get('channel');

    if (msg.content.startsWith(ignore_prefix) || msg.author.bot || (channel === ' ') === (msg.channel.name === channel)) return;

    console.log(msg.content);

    if (msg.content.startsWith(prefix)) {
        const args = msg.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (!client.commands.has(command)) {
            msg.reply('Unknown command!')
            return;
        }

        try {
            client.commands.get(command).execute(data, msg, args);
        } catch (error) {
            console.error(error);
            msg.reply('There was an error trying to execute that command!');
        }

        return;
    }
});
