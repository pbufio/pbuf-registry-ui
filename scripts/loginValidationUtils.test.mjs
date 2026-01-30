import { strict as assert } from 'node:assert'

const { getLoginValidationErrorMessage } = await import('../src/utils/loginValidationUtils.js')

assert.equal(getLoginValidationErrorMessage({ response: { status: 401 } }), 'Invalid token')
assert.equal(
  getLoginValidationErrorMessage({ response: { status: 403 } }),
  'Token is valid but has no read access'
)
assert.equal(
  getLoginValidationErrorMessage({ response: { status: 500 } }),
  'Unable to verify token (HTTP 500)'
)
assert.equal(getLoginValidationErrorMessage({}), 'Unable to verify token (network error)')
assert.equal(getLoginValidationErrorMessage(null), 'Unable to verify token (network error)')

console.log('loginValidationUtils: OK')
