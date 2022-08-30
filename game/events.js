require('dotenv').config();
const gameFunctions = require('./functions');
const { EmbedBuilder } = require('discord.js');

module.exports = { OnStart };

async function OnStart(channel, client) {
    try {

        const filter = m => !(m.author.bot || m.content.startsWith(process.env.IGNORE_PREFIX));
        client.collectors.set(channel.id, channel.createMessageCollector({ filter }));

        const collector = client.collectors.get(channel.id);

        console.log(`[${new Date(Date.now()).toISOString()}] Bot now listening to messages in #${channel.name}.`);

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

async function OnMessage(message, client) {
    try {    
        const query = await client.sequelize.models.Channel.findOne({
            where: {
                id: message.channel.id,
            },
        });

        const validationRespone = await gameFunctions.validateWord(message.content, message.author.id, query.dataValues.nextchars, query.dataValues.lastAuthor, client);

        if (validationRespone.error) {
            message.reply({ content: validationRespone.message, ephemeral: true })
            message.react('❌');

            // TODO: increment and test mistakes
            return;
        }

        await client.sequelize.models.Channel.update(
            { 
                nextchars: validationRespone.chars,
                lastAuthor: message.author.id,
            }, 
            {
			    where: {
				    id: message.channel.id,
			    },
            }
        );

        await client.sequelize.models.Word.create({
            word: validationRespone.message,
            channel: message.channel.id,
        });

        message.react('✅');
    } catch (error) {
        console.log(error);

        // TODO: Handle error
    }
}
