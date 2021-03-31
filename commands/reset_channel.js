module.exports = {
	name: 'reset_channel',
	async execute(data, message, args) {
        await data.set('status', 'ready');
		await data.delete('channel');
	},
};
