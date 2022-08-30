const events = require('./events.js');

module.exports = { StartUp };

async function StartUp(client) {
    try {
        const query = await client.sequelize.models.Channel.findAll();
        query.forEach(async record => {
            const channel = await client.channels.cache.get(record.dataValues.id);
            if(channel) {
                events.OnStart(channel, client);
            } else {
                try {
                    await client.sequelize.models.Channel.destroy({
                        where: {id: record.dataValues.id}
                    });
                    await client.sequelize.models.Word.destroy({
                        where: {channel: record.dataValues.id}
                    });
                    try {
                        console.log(`Removed non accessible channel with id ${record.dataValues.id} in ${client.guilds.cache.get(record.dataValues.server).name}.`);
                    } catch(e) {
                        console.log(`Removed non accessible channel with id ${record.dataValues.id} in non accessible server with id ${record.dataValues.server}.`);
                    }
                } catch(e) {
                    console.error("Error removing deleted channels from database.");
                    console.error(e);
                }
            }
        });
    } catch(e) {
        console.error("Couldn't start up channels.");
        console.error(e);
    }
}
