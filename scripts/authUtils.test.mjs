import assert from 'node:assert/strict'
import { normalizeToken, parseBool } from '../src/utils/authUtils.js'

// normalizeToken
assert.equal(normalizeToken(''), '')
assert.equal(normalizeToken('  pbuf_user_abc  '), 'pbuf_user_abc')
assert.equal(normalizeToken('Bearer pbuf_user_abc'), 'pbuf_user_abc')
assert.equal(normalizeToken('bearer    pbuf_user_abc'), 'pbuf_user_abc')

// parseBool
assert.equal(parseBool(undefined), false)
assert.equal(parseBool(''), false)
assert.equal(parseBool('0'), false)
assert.equal(parseBool('1'), true)
assert.equal(parseBool('true'), true)
assert.equal(parseBool('YES'), true)
assert.equal(parseBool('$PUBLIC_ENABLED'), false)

console.log('authUtils: OK')
