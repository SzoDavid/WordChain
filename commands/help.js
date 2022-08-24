const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Replies with informations about the bot.')
		.setDMPermission(false),
	async execute(interaction) {
		const aboutEmbed = new EmbedBuilder()
			.setColor(0xed1c24)
			.setTitle('Help')
			.setDescription('This bot currently uses very few commands, which can change.')
			.addFields(
				{ name: 'Commands', value: '`/status`: Replies with status informations about the bot.'},
				{ name: 'Admin only commands', value: '`/set_channel`: This command adds the channel to the list of channels where the bot will operate on.\n' +
					'`/update_channel`: Update the maximum number of mistakes in a row allowed in the channel.' },
              // TODO: Put newer commands here.
				{ name: 'Source Code', value: '[GitHub](https://github.com/SzoDavid/WordChain)' },
			);

		await interaction.reply({ embeds: [aboutEmbed] });
	},
}
