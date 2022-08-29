#!/usr/bin/env node

require('dotenv').config();
const fs = require('fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

const prefix = process.env.PREFIX;
const ignore_prefix = process.env.IGNORE_PREFIX;
const memory_limit = process.env.WORD_MEMORY_LIMIT;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

require('./database/config').config('database.sqlite', client);

client.collectors = new Collection();

// Command handler
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

// Event handler
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(client, ...args));
	} else {
		client.on(event.name, (...args) => event.execute(client, ...args));
	}
}

client.login(process.env.DISCORD_TOKEN);

/*
	// words
	const status = await data.get('status')
	if (status === 'started') {
		const word = formatString(msg.content);
		if (word === '') return;

		await data.set('next', lastChar(word));
		await data.set('status', 'in progress');
		await data.set('strike', '1');
		await data.set('words', [word]);
		msg.react('✅');
		return;
	}
	if (status === 'in progress') {
		const word = formatString(msg.content);
		console.log('Formatted: ' + word);
		if (word === '') return;

		const first = await data.get('next');
		var strike = await data.get('strike');
		var words = await data.get('words')

		// incorrect word
		const firstCharCorrect = testFisrtChar(word, first);
		const repeatedWord = words.includes(word);

		if (!firstCharCorrect || repeatedWord || word.includes(' ')) {
			var mistakes = await data.get('mistakes');
			mistakes++;
			await data.set('mistakes', mistakes);
			msg.react('❌');

			var error_msg = '';
			if (repeatedWord) error_msg += 'you can\'t use one word multiple times! ';
			else if (!firstCharCorrect) error_msg += 'your word does not start with the correct character! ';
			else error_msg += 'this is word chain not words chain, you should write one word only! ';

			if (mistakes == 1) msg.reply(error_msg + 'Try again!');
			else {
				msg.reply(error_msg + 'You ruined it at '+ strike +'! :person_facepalming:');
				client.commands.get('start').execute(data, msg, 'reset');
			}
			return;
		}

		// correct
		await data.set('next', lastChar(word));
		await data.set('mistakes', 0);
		await data.set('strike', ++strike);

		// Celebrate every 50 word
		if (strike % 50 === 0) msg.channel.send('🎉 Woohoo! This is the ' + strike + '. word! 🎉\n');

		// remember word
		words.push(word);
		if(words.length > memory_limit) words.shift();
		await data.set('words', words);

		msg.react('✅');
	}

*/
