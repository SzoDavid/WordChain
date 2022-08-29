const startup = require("../game/startup.js");

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`[${new Date(Date.now()).toISOString()}] Ready! Logged in as ${client.user.tag}`);
        
        await client.sequelize.models.Word.sync();
	    await client.sequelize.models.Channel.sync();

        try {
            await client.sequelize.authenticate();
            console.log(`[${new Date(Date.now()).toISOString()}] Database connection has been established successfully`);
        } catch (error) {
            console.error(`[${new Date(Date.now()).toISOString()}] Unable to connect to the database:\n`, error);
        }

        client.user.setPresence({ activities: [{ name: '/help', type: 2 }], status: 'online' });

        startup.StartUp(client);
    },
};
