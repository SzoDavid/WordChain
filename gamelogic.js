module.exports = { OnEnd, OnRemove, OnUpdate, OnStart, OnCreate };

function OnEnd() {
    // TODO
}

function OnRemove() {
    // TODO
}

function OnUpdate() {
    // TODO
}

function OnStart() {
    // TODO
}

function OnCreate() {
    // TODO
}

// PRIVATE FUNCTIONS

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
