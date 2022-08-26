const gameEvents = require('./events');

module.exports = { Remove, Create, Update };

function Remove() {
	return false;
    // TODO
}

async function Create(interaction, client) {
    try {
		await client.sequelize.models.Channel.create({ 
			mistakesAllowed: interaction.options.getInteger('mistakes_allowed'),
			id: interaction.channel.id,
			server: interaction.guild.id
		});

		gameEvents.OnStart(interaction.channel, client);

		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

async function Update(channelId, mistakesAllowed, client) {
	try {
		await client.sequelize.models.Channel.update({ mistakesAllowed: mistakesAllowed }, {
			where: {
				id: channelId,
			}
		});
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}
