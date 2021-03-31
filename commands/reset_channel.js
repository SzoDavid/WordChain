module.exports = {
	name: 'reset_channel',
	async execute(data, message, args) {
		if (!message.member.hasPermission("ADMINISTRATOR")) {
			message.reply('Only admins can use this command!');
			return;
		}
        await data.set('status', 'ready');
		await data.delete('channel');
		message.react('✅');
	},
};
