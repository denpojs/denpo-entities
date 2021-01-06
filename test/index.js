
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
		let str = `*${testString}*`
		is(`*\\*${testString}\\**`, str, {type: 'bold', offset: 0, length: str.length})
	})

	it('broken', () => {
		is(`*${testString}`, testString, {type: 'bold', offset: 0, length})
	})

	it('nested', () => {
		is(`*__${testString}__*`, `${testString}`, {type: 'underline', offset: 0, length}, {type: 'bold', offset: 0, length})
	})

	it('italic in underline', () => {
		is(`___${testString}__${testString}___`, `${testString}${testString}`,
		{type: 'italic', offset: 0, length},
		{type: 'italic', offset: length, length},
		{type: 'underline', offset: 0, length: length * 2}
		)
	})

	it('complex', () => {
		is(`*bold \\*text*
		_italic \\*text_
		__underline__
		~strikethrough~
		*bold _italic bold ~italic bold strikethrough~ __underline italic bold___ bold*
		[inline URL](http://www.example.com/)
		[inline mention of a user](tg://user?id=123456789)
		\`inline fixed-width code\`
		\`\`\`
		pre-formatted fixed-width code block
		\`\`\`
		\`\`\`python
		pre-formatted fixed-width code block written in the Python programming language
		\`\`\``,

		`bold *text
		italic *text
		underline
		strikethrough
		bold italic bold italic bold strikethrough underline italic bold bold
		inline URL
		inline mention of a user
		inline fixed-width code
		pre-formatted fixed-width code block
		pre-formatted fixed-width code block written in the Python programming language`
		,

		{
			"length": 10,
			"offset": 0,
			"type": "bold"
		},
		{
			"length": 12,
			"offset": 13,
			"type": "italic"
		},
		{
			"length": 9,
			"offset": 28,
			"type": "underline"
		},
		{
			"length": 13,
			"offset": 40,
			"type": "strikethrough"
		},
		{
			"length": 25,
			"offset": 73,
			"type": "strikethrough"
		},
		{
			"length": 38,
			"offset": 61,
			"type": "italic"
		},
		{
			"length": 21,
			"offset": 99,
			"type": "italic"
		},
		{
			"length": 10,
			"offset": 128,
			"type": "text_link",
			"url": "http://www.example.com/"
		},
		{
			"length": 24,
			"offset": 141,
			"type": "text_link",
			"url": "tg://user?id=123456789"
		},
		{
			"length": 23,
			"offset": 168,
			"type": "code"
		},
		{
			"language": "",
			"length": 36,
			"offset": 194,
			"type": "pre"
		},
		{
			"language": "python",
			"length": 79,
			"offset": 233,
			"type": "pre"
		},
		{
			"length": 187,
			"offset": 125,
			"type": "bold"
		},
		{
			"length": 192,
			"offset": 120,
			"type": "underline"
		},
		{
			"length": 256,
			"offset": 56,
			"type": "bold"
		}
		)
	})
})
