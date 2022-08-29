module.exports = { validateWord };

async function validateWord(rawWord, rawChars, client) {
	const word = await formatString(rawWord);

	if (await word.includes(' ')) {
		return {
			error: true,
			message: 'Send only a single word please!',
			chars: '',
		};
	}

	if (rawChars !== '[]') {
		if (!await testFisrtChar(word, await JSON.parse(rawChars))) {
			return {
				error: true,
				message: 'Your word should start with the last letter of the previous word.\n**Note:** Someone might have been a prankster and deleted their word, run `/status` to check what letter\'s next.', 
				chars: '',
			}
		}

		const query = await client.sequelize.models.Word.findAll({
            where: {
                word: word,
            },
        });

		if (query.length !== 0) {
			return {
				error: true,
				message: 'Someone has already used this word. Be a bit more creative! :wink:', 
				chars: '',
			}
		}
	}

	return {
		error: false,
		message: word,
		chars: JSON.stringify(lastChar(word)),
	};
}

function lastChar(word) {
	var test_chars = ['cs', 'dz', 'gy', 'ly', 'ny', 'sz', 'ty', 'zs'];
	var chars = [];
	if (test_chars.includes(word.slice(-2))) chars.push(word.slice(-2));
	if (word.lenght > 3) {
		if (word.slice(-3) === 'dzs') chars.push('dzs');
	}
	if (word.slice(-2) === 'ly') chars.push('j');
	chars.push(word.slice(-1));

	return chars;
}

function testFisrtChar(word, chars) {
	return (chars.includes(word.charAt(0)) || chars.includes(word.slice(0, 2)) || chars.includes(word.slice(0, 3)));
}

function formatString(str) {
	return str.replace(/ *\([^)]*\) */g, '').replace(/ *\<[^)]*\> */g, '').replace('.','').trim().toLowerCase();
}
