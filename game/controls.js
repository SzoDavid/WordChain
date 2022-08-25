module.exports = { Remove, Create, Update };

function Remove() {
	return false;
    // TODO
}

function Create() {
    // TODO
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
