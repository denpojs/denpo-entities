# denpo-entities
Markdown to telegram entities parser

# Usage
```js
let dent = require('denpo-entities')
let assert = require('assert').strict

assert.deepEqual(dent('*md text*'), {
	entities: [
		{
			type: 'bold',
			length: 7,
			offset: 0
		}
	],
	text: 'md text'
})
```

[Supported markdown style](https://core.telegram.org/bots/api#markdownv2-style)