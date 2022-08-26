const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const gamecontrol = require('../game/controls');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set_channel')
		.setDescription('Set the current channel.')
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
        
        // TODO: Check if the bot can access the channel or not.
        
        if (query) {
            await interaction.reply({ content: 'This channel is already set as the channel', ephemeral: true });
            return;
        }

        if (!gamecontrol.Create(interaction, client)) {
            await interaction.reply({ content: 'Couldn\'t set as channel :c', ephemeral: true });
            return;
        }

        await interaction.reply({ content: 'Channel is set successfully!', ephemeral: true });
	},
}

