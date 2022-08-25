module.exports = { GetBotStatus, GetChannelStatus };

async function GetBotStatus(serverId, client) {
    let query = await client.sequelize.models.Channel.findAll({
        attributes: [[client.sequelize.fn('COUNT', client.sequelize.col('id')), 'n_id'],]
    });
    const numChannels = query[0].dataValues.n_id;

    query = await client.sequelize.models.Channel.findAll({
        attributes: ['id'],
        where: {
            server: serverId,
        },
    });
    
    let channels = '';
    query.forEach(obj => {
        channels += `<#${obj.dataValues.id}> `;
    });

    return {
        numChannels: numChannels,
        channels: channels, 
    };
}

async function GetChannelStatus(channelId, query, client) {
	const query_score = await client.sequelize.models.Word.findOne({
        attributes: [[client.sequelize.fn('COUNT', client.sequelize.col('id')), 'n_id'],],
        where: {
            channel: channelId,
        },
    });

    const achars = JSON.parse(query.dataValues.nextchars);
    let chars = '';
    if (achars.length === 0) {
        chars = 'Any';
    } else {
        achars.forEach(char => {
            chars += `${char} `;
        });
    }

    return {
        highscore: query.dataValues.highscore,
        score: query_score.dataValues.n_id,
        mistakes: query.dataValues.mistakes,
        mistakesAllowed: query.dataValues.mistakesAllowed,
        nextLetter: chars,
    };
}
