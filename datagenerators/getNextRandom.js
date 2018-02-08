var randomstring = require('randomstring');

const getNextRandom = () => {
	return randomstring.generate(12);
}

console.log(getNextRandom());