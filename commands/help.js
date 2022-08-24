const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Replies with informations about the bot.')
		.setDMPermission(false),
	async execute(interaction) {
		const aboutEmbed = new EmbedBuilder()
			.setColor(0xFF0099)
			.setTitle('Help')
			.setDescription('This bot currently uses very few commands, which can change.')
			.addFields(
				{ name: '/set_channel', value: '`/set_channel`: [*] This command adds the channel to the list of channels where the bot will operate on. Requires administrator privileges.' },
				{ name: '/status', value: '`/status`: Replies with status informations about the bot.' },
              // TODO: Put newer commands here.
				{ name: 'Source Code', value: '[GitHub](https://github.com/SzoDavid/WordChain)' },
			);

		await interaction.reply({ embeds: [aboutEmbed] });
	},
}
