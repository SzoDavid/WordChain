require('dotenv').config();
const { EmbedBuilder } = require('discord.js');

module.exports = { OnStart };

async function OnStart(channel, client) {
    try {    
        const query = await client.sequelize.models.Channel.findOne({
            where: {
                id: channel.id,
            },
        });

        if (!query) {
            return;
        }

        const filter = m => !(m.author.bot || m.content.startsWith(process.env.IGNORE_PREFIX));
        client.collectors.set(channel.id, channel.createMessageCollector({ filter }));

        const collector = client.collectors.get(channel.id);

        collector.on('collect', message => {
            OnMessage(message, client)
        });

        collector.on('end', collected => {
            OnEnd(collected, client);
        });
    } catch (error) {
        console.log(error);

        const errorEmbed = new EmbedBuilder()
            .setColor(0xed1c24)
            .setTitle(`Error`)
            .setDescription('Oops, something unexpected happened! Ask a moderator to restart the game!');
        
        await channel.send({ embeds: [errorEmbed] });
    }
}

function OnEnd(collected, client) {
    console.log(collected)
    // TODO
}

function OnMessage(message, client) {
    console.log(message)
    // TODO
}
