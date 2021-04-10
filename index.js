#!/usr/bin/env node

require('dotenv').config();

const prefix = process.env.PREFIX;
const ignore_prefix = process.env.IGNORE_PREFIX;
const memory_limit = process.env.WORD_MEMORY_LIMIT;
const db_adress = process.env.DB_ADRESS;

const Keyv = require('keyv');
const data = new Keyv(db_adress);

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
	const status = await data.get('status');
	if (status === undefined) await data.set('status', 'ready');
    console.log("Bot is ready!");
});

client.on('message', async msg => {
    const channel = await data.get('channel');

    if (msg.content.startsWith(ignore_prefix) || msg.author.bot || (channel === undefined) === (msg.channel.name === channel)) return;

    console.log(msg.content);

	// commands
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
		if (word === '') return;

		const first = await data.get('next');
		var strike = await data.get('strike');
		var words = await data.get('words')

		// incorrect word
		const firstCharCorrect = testFisrtChar(word, first);
		const repeatedWord = words.includes(word);

		if (!firstCharCorrect || repeatedWord) {
			var mistakes = await data.get('mistakes');
			mistakes++;
			await data.set('mistakes', mistakes);
			msg.react('❌');

			var error_msg = '';
			if (repeatedWord) error_msg += 'you can\'t use one word multiple times! ';
			else error_msg += 'your word does not start with the correct character! ';

			if (mistakes == 1) msg.reply(error_msg + 'Try again!');
			else {
				msg.reply(error_msg + 'You ruined it at '+ strike +'! :person_facepalming:');
				client.commands.get('start').execute(data, msg, undefined);
			}
			return;
		}

		// correct
		await data.set('next', lastChar(word));
		await data.set('mistakes', 0);
		await data.set('strike', ++strike);

		// Celebrate every 50 word
		if (strike % 50 === 0) msg.channel.send('🎉 Woohoo! This is the ' + strike + '. word! 🎉');

		// remember word
		words.push(word);
		if(words.length > memory_limit) words.shift();
		await data.set('words', words);

		msg.react('✅');
	}

});

/* FUNCTIONS */

function lastChar(word) {
	var test_chars = ['cs', 'dz', 'gy', 'ly', 'ny', 'sz', 'ty', 'zs'];
	var chars = [];
	if (test_chars.includes(word.slice(-2))) chars.push(word.slice(-2));
	if (word.lenght > 3) {
		if (word.slice(-3) === 'dzs') chars.push('dzs');
	}
	if (word.slice(-2) === 'ly') chars.push('j');
	chars.push(word.slice(-1));

	return chars;
}

function testFisrtChar(word, chars) {
	return (chars.includes(word.charAt(0)) || chars.includes(word.slice(0, 2)) || chars.includes(word.slice(0, 3)));
}

function formatString(str) {
	return str.replace(/ *\([^)]*\) */g, '').replace('.','').trim().toLowerCase();
}
