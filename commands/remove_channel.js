const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const gamecontrol = require('../game/controls');

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

        if (!gamecontrol.Remove(interaction.channel.id, client)) {
            await interaction.reply({ content: 'Couldn\'t remove channel :c', ephemeral: true });
            return;
        }

        await interaction.reply({ content: 'Channel is removed successfully!', ephemeral: true });
	},
}
