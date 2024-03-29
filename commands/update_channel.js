const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const gamecontrol = require('../game/controls');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('update_channel')
		.setDescription('Update the maximum number of mistakes in a row allowed in the channel.')
		.setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addIntegerOption(option =>
			option.setName('mistakes_allowed')
				.setDescription('Number of mistakes allowed')
				.setRequired(true)),
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

        if (!gamecontrol.Update(interaction.channel.id, interaction.options.getInteger('mistakes_allowed'), client)) {
            await interaction.reply({ content: 'Couldn\'t update channel :c', ephemeral: true });
            return;
        }

        await interaction.reply({ content: 'Channel is updated successfully!', ephemeral: true });
	},
}
