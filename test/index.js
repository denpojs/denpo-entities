
let {deepStrictEqual} = require('assert/strict')
let dent = require('../')

function is(input, text, ...entities) {
	deepStrictEqual(dent(input), {
		text,
		entities
	}, '')
}


// console.log(dent('[__*test*__](link) *\\*test\\**asd'))

let testString = 'test string'
let length = testString.length

describe('Simple', () => {
	let tests = [
		'*,bold',
		'_,italic',
		'__,underline',
		'~,strikethrough',
		'`,code',
	]

	for(let test of tests) {
		let [target, type] = test.split(',')
		it(type, () => is(target + testString + target, testString, {type, offset: 0, length}))
	}

	it('link', () => {
		is(`[${testString}](t.me)`, testString, {
			type: 'text_link',
			url: 't.me',
			offset: 0,
			length
		})
	})

	it('pre', () => {
		is(`\`\`\`
		${testString}
		\`\`\``, `${testString}`, {type: 'pre', offset: 0, length, language: ''})
	})

	it('pre with language', () => {
		is(`\`\`\`js
		${testString}
		\`\`\``, `${testString}`, {type: 'pre', offset: 0, length, language: 'js'})
	})
})

describe('Advanced', () => {
	it('escaping', () => {
		let str = `\\*${testString}\\*`
		is(`*${str}*`, str, {type: 'bold', offset: 0, length: str.length})
	})

	it('broken', () => {
		is(`*${testString}`, testString, {type: 'bold', offset: 0, length})
	})

	it('nested', () => {
		is(`*__${testString}__*`, `${testString}`, {type: 'underline', offset: 0, length}, {type: 'bold', offset: 0, length})
	})
})

console.log(dent(`*bold
  _italic bold
    ~italic bold strikethrough~
    __underline italic bold__
  _
bold*`))
