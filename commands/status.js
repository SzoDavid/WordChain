module.exports = {
	name: 'status',
	async execute(data, message, args) {
        const status = await data.get('status');
        const channel = await data.get('channel');

		message.channel.send('Status:\t' + status + '\nChannel:\t' + channel);
	},
};
