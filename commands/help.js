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
				{ name: '/set_channel', value: '`/set_channel`: [*] This command changes the channel the bot operates on. The bot can only work in one channel. Requires administrator privileges.' },
              // TODO: Put newer commands here.
				{ name: 'Source Code', value: '[GitHub](https://github.com/SzoDavid/WordChain)' },
			);

		await interaction.reply({ embeds: [aboutEmbed] });
	},
}
