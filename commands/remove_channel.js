const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const gamecontrol = require('../game/controls');
const gamestatus = require('../game/status');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove_channel')
		.setDescription('Stop using the current channel.')
		.setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
	async execute(interaction, client) {
        const query = await client.sequelize.models.Channel.findOne({
            where: {
                id: interaction.channel.id,
            },
        });

        if (!query) {
            await interaction.reply({ content: 'This channel is not connected with the WordChain bot.', ephemeral: true });
            return;
        }

        try {
            const status = await gamestatus.GetChannelStatus(interaction.channel.id, query, client)

            const removeEmbed = new EmbedBuilder()
            .setColor(0xed1c24)
            .setTitle('Removed channel')
            .setDescription(`The bot no longer uses this channel, if you want to use it again, or it was a mistake, ask an Administrator to restart the game!`)
            .addFields(
                { name: 'The highest score on this channel was', value: `${status.highscore}`, inline: true },
                { name: 'Last score', value: `${status.score}`, inline: true },
                { name: 'Mistakes allowed', value: `${status.mistakesAllowed}`, inline: true },
            );
            await client.channels.cache.get(interaction.channel.id).send( { embeds: [removeEmbed]});
        } catch (error) {
            await interaction.reply({ content: 'Couldn\'t set as channel (Most likely a permission issue) :c ', ephemeral: true });
            console.error(error);
            return;
        }

        if (!gamecontrol.Remove(interaction.channel.id, client)) {
            await interaction.reply({ content: 'Couldn\'t remove channel :c', ephemeral: true });
            return;
        }

        await interaction.reply({ content: 'Channel is removed successfully!', ephemeral: true });
	},
}
