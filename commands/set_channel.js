const { SlashCommandBuilder, PermissionsBitField, Client, EmbedBuilder } = require('discord.js');
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
        
        if (query) {
            await interaction.reply({ content: 'This channel is already set as the channel', ephemeral: true });
            return;
        }
        
        try {
            const startEmbed = new EmbedBuilder()
			.setColor(0xed1c24)
			.setTitle('Ready, set, WordChain!')
            .setDescription(`The game has started! Messages starting with \`${process.env.IGNORE_PREFIX}\` will be ignored. Have fun!`)
            .addFields(
				{ name: 'What is word chain', value: 'Word chain is a word game in which players come up with words that begin with the letter or letters that the previous word ended with.'},
				{ name: 'About word chain:', value: '[Wikipedia](https://en.wikipedia.org/wiki/Word_chain)'},
				{ name: 'Source Code', value: '[GitHub](https://github.com/SzoDavid/WordChain)', inline: true },
                { name: 'Submit issues', value: '[GitHub](https://github.com/SzoDavid/WordChain/issues/new)', inline: true }
			);
            await client.channels.cache.get(interaction.channel.id).send( { embeds: [startEmbed]});
        } catch (error) {
            await interaction.reply({ content: 'Couldn\'t set as channel (Most likely a permission issue) :c ', ephemeral: true });
            console.error(error);
            return;
        }
        
        if (!gamecontrol.Create(interaction, client)) {
            await interaction.reply({ content: 'Couldn\'t set as channel :c', ephemeral: true });
            return;
        }

        await interaction.reply({ content: 'Channel is set successfully!', ephemeral: true });
	},
}

