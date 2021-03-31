module.exports = {
	name: 'status',
	async execute(data, message, args) {
        const status = await data.get('status');
        const channel = await data.get('channel');
		const next = await data.get('next')
		const strike = await data.get('strike');

		message.channel.send('Status:\t\t\t\t' + status
			+ '\nChannel:\t\t\t' + channel
			+ '\nNext char:\t\t ' + next
			+ '\nStrike:\t\t\t\t' + strike);
	},
};
