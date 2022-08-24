const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

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
        try {
            const res = await client.sequelize.models.Channel.update({ mistakesAllowed: interaction.options.getInteger('mistakes_allowed') }, {
                where: {
                    id: interaction.channel.id,
                }
            });

            if (res[0] === 0) {
                await interaction.reply({ content: 'This channel is not connected with the WordChain bot.', ephemeral: true });
                return;
            }

            await interaction.reply({ content: 'Channel is updated successfully!', ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Couldn\'t update channel :c', ephemeral: true });
        }
	},
}
