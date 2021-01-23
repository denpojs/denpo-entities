
module.exports = function dent(input) {
	let entities = []
	let output = ''

	// Core
	let pos = 0, ch, terminal

	function move(offset = 1) {
		let c = ch

		ch = input[pos += offset] || ''
		if(ch == '\\') {
			ch = input[++pos]
			terminal = false
		}
		else terminal = true

		return c
	}

	function is(target) {
		if(!terminal) return
		if(typeof target == 'string') {
			if(ch != target[0]) return

			let {length} = target

			if(length == 1) return move()

			let str = input.substr(pos, length)
			if(str == target) {
				move(str.length)
				return str
			}
		}
		else {
			let str = ''

			while(ch && target())
				str += move()

			return str
		}
	}

	function before(target) {
		return is(() => !is(target))
	}

	// Lex
	function bold() {
		return is('*') && {
			type: 'bold',
			length: proc('*')
		}
	}

	function code() {
		return is('`') && {
			type: 'code',
			length: proc('`')
		}
	}

	function italic() {
		return is('_') && {
			type: 'italic',
			length: proc('_')
		}
	}

	function underline() {
		return is('__') && {
			type: 'underline',
			length: proc('__')
		}
	}

	function strikethrough() {
		return is('~') && {
			type: 'strikethrough',
			length: proc('~')
		}
	}

	function link() {
		return is('[') && {
			type: 'text_link',
			length: proc(']('),
			url: before(')')
		}
	}

	function pre() {
		return is('```') && {
			type: 'pre',
			language: before('\n'),
			text: before('```').trim()
		}
	}

	function token() {
		return link() || bold() || strikethrough() || underline() || italic() || pre() || code() || {text: move()}
	}

	function proc(target) {
		let length = 0

		while(ch && !is(target)) {
			let offset = output.length

			let {text, ...current} = token()

			if(text) {
				current.length = text.length
				output += text
			}
			length += current.length

			if(current.type) {
				current.offset = offset

				entities.push(current)
			}
		}

		return length
	}

	move(0)
	proc('')

	return {
		text: output,
		entities
	}
}
