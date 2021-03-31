module.exports = {
	name: 'start',
	async execute(data, message, args) {
		message.channel.send('Game is started. Type in the first word!');
        await data.set('status', 'started');
        await data.set('channel', message.channel.name);
	},
};
