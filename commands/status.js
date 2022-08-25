const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const gamestatus = require('../game/status');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Replies with status informations about the bot.')
		.setDMPermission(false),
	async execute(interaction, client) {
		const statusEmbed = new EmbedBuilder()
			.setColor(0xed1c24)
			.setTitle('Status');

        let query = await client.sequelize.models.Channel.findOne({
            where: {
                id: interaction.channel.id,
            },
        });

        // If channel is used by WordChain
        if (query) {
            const status = await gamestatus.GetChannelStatus(interaction.channel.id, query, client)
            
            statusEmbed.addFields(
                { name: 'High score', value: `${status.highscore}`, inline: true },
                { name: 'Current score', value: `${status.score}`, inline: true },
                { name: 'Mistakes', value: `${status.mistakes}` },
                { name: 'Mistakes allowed', value: `${status.mistakesAllowed}` },
                { name: 'Next letter', value: `${status.nextLetter}` },
            );
        } else {
            const status = await gamestatus.GetBotStatus(interaction.guildId, client);

            statusEmbed.addFields(
                { name: 'Number of active channels', value: `${status.numChannels}` },
                { name: 'In this server', value: `${status.channels}` },
            );
        }

		await interaction.reply({ embeds: [statusEmbed] });
	},
}
