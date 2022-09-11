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

            if (query.dataValues.mistakes === query.dataValues.mistakesAllowed) {
                message.react('❌');
                Reset(message.channel, client);
                return;
            }
            console.log(await client.sequelize.models.Channel.increment({ mistakes: 1}, { where: { id: message.channel.id }}));

            message.react('❌');
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
    }
}

async function Reset(channel, client) {
    const query_score = await client.sequelize.models.Word.findOne({
        attributes: [[client.sequelize.fn('COUNT', client.sequelize.col('id')), 'n_id'],],
        where: {
            channel: channel.id,
        },
    });
    
    const channel_query = await client.sequelize.models.Channel.findOne({
            where: {
                id: channel.id,
            },
        });
    
    await client.sequelize.models.Word.destroy({
			where: {
				channel: channel.id,
			},
		});
    
    await client.sequelize.models.Channel.update({ 
        mistakes: 0,
        nextchars: '[]',
        lastAuthor: '',
        score: 0
    }, {
        where: {
            id: channel.id,
        }
    });
    const score = query_score.dataValues.n_id;
    const high_score = channel_query.dataValues.highscore;
    
    if (score > high_score) {
        await client.sequelize.models.Channel.update({ highscore: score}, {
			where: {
				id: channel.id,
			}
		});
        var changed_highscore = true;
    } else {
        var changed_highscore = false;
    }
    
    const resetEmbed = new EmbedBuilder()
        .setColor(0xed1c24)
        .setTitle('You have made too many mistakes!')
        .setDescription(`The game has been restarted! Have fun!`);
        if (high_score === 0) {
            resetEmbed.addFields({ name: 'Score', value: `The score of the first game in this channel is ${score}.`});
        }
        else if (changed_highscore) {
            resetEmbed.addFields({ name: 'Score', value: `🥳 Congratulations! 🥳 You've just set a new high score! The score is ${score}, which is higher then the previous high score of ${high_score} in this channel.`});
        } else {
            resetEmbed.addFields({ name: 'Score', value: `This game's score is ${score}. The high score in this channel is ${high_score}, try to beat it!`});
        }    
        await client.channels.cache.get(channel.id).send( { embeds: [resetEmbed]});

    await client.collectors.get(channel.id).stop();
    await client.collectors.delete(channel.id);
    OnStart(channel, client);
}
