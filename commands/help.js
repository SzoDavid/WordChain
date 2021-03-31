module.exports = {
	name: 'help',
	execute(data, message, args) {
		message.channel.send('**Commands:**\n*wc!help*\n*wc!status*\n*wc!start* [admin only]\n*wc!reset_channel* [admin only]\n\n' +
            '**Gameplay:**\nBasic word chain. Start game with *wc!start*. Words between brackets and messages starting with \"//\" will be ignored.\n' +
			'Where you start the game first time, that will be the only channel where the bot will work. Use *wc!reset_channel* to be able to choose a new channel.\n\n' +
			'**Source:**\nhttps://github.com/SzoDavid/WordChain');
	},
};
