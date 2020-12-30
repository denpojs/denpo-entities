
module.exports = function dent(formated) {
	let entities = []
	let res = ''

	// Core
	let pos = 0, ch
	move(0)

	function move(offset = 1) {
		let c = ch

		ch = formated[pos += offset] || ''
		if(ch == '\\') ch += formated[++pos]

		return c
	}

	function is(target) {
		if(typeof target == 'string') {
			if(ch != target[0]) return

			let {length} = target

			if(length == 1) return move()

			let str = formated.substr(pos, length)
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
	function simple(trigger, type) {
		return () => is(trigger) && {
			type,
			length: proc(trigger)
		}
	}

	let bold = simple('*', 'bold')
	let code = simple('`', 'code')
	let italic = simple('_', 'italic')
	let underline = simple('__', 'underline')
	let strikethrough = simple('~', 'strikethrough')


	function link() {
		if(is('[')) return {
			type: 'text_link',
			length: proc(']('),
			url: before(')')
		}
	}

	function pre() {
		if(is('```')) return {
			type: 'pre',
			language: before('\n'),
			text: before('```').trim()
		}
	}

	function txt() {
		return {text: move()}
	}

	function proc(target) {
		let length = 0

		while(ch && !is(target)) {
			let offset = res.length

			let {text, ...cur} = link() || bold() || strikethrough() || underline() || italic() || pre() || code() || txt()

			if(text) {
				cur.length = text.length
				res += text
			}
			length += cur.length

			if(cur.type) {
				cur.offset = offset

				entities.push(cur)
			}
		}

		return length
	}

	proc('')

	return {
		text: res,
		entities
	}
}
