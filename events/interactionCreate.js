module.exports = {
	name: 'interactionCreate',
	execute(client, interaction) {
        if (!interaction.isChatInputCommand()) return;

		console.log(`[${new Date(Date.now()).toISOString()}] ${interaction.user.tag} in #${interaction.channel.name} triggered "${interaction.commandName}".`);

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			command.execute(interaction, client);
		} catch (error) {
			console.error(error);
			interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};
