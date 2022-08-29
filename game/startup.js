const events = require('./events.js');
const { Client } = require('discord.js');

module.exports = { StartUp };

async function StartUp(client) {
     try {
        const query = await client.sequelize.models.Channel.findAll();
         query.forEach(async record => {
             const channel = await client.channels.cache.get(record.dataValues.id);
             if(channel) {
                 events.OnStart(channel, client);
            } else {
                console.log("Channel isn't available (probably because the channel was deleted)."); // TODO: Better managing of this, and probably deleting it from the database.
            }
         });
     } catch(e) {
         console.error("Couldn't start up channels.");
         console.error(e);
     }
}
