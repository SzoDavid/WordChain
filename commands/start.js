module.exports = {
	name: 'start',
	async execute(data, message, args) {
		message.channel.send('Game is started. Type in the first word!');
        await data.set('status', 'started');
        await data.set('channel', message.channel.name);
		await data.set('mistakes', 0);
		await data.set('strike', 0);
		await data.set('words', []);
	},
};
