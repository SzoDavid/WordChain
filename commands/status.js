const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Replies with status informations about the bot.')
		.setDMPermission(false),
	async execute(interaction, client) {
		const statusEmbed = new EmbedBuilder()
			.setColor(0xFF0099)
			.setTitle('Status');

        let query = await client.sequelize.models.Channel.findAll({
            attributes: [[client.sequelize.fn('COUNT', client.sequelize.col('id')), 'n_id'],],
            where: {
                id: interaction.channel.id,
            },
        });

        // If channel is not used by WordChain
        if (query[0].dataValues.n_id === 0) {
            query = await client.sequelize.models.Channel.findAll({
                attributes: [[client.sequelize.fn('COUNT', client.sequelize.col('id')), 'n_id'],]
            });
            const numChannels = query[0].dataValues.n_id;

            query = await client.sequelize.models.Channel.findAll({
                attributes: ['id'],
                where: {
                    server: interaction.guildId,
                },
            });
            
            let servers = '';
            query.forEach(obj => {
                servers += `<#${obj.dataValues.id}>`;
            });

            statusEmbed.addFields(
                { name: 'Number of active channels', value: `${numChannels}` },
                { name: 'In this server', value: servers },
            );
        }

		await interaction.reply({ embeds: [statusEmbed] });
	},
}
