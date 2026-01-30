import { strict as assert } from 'node:assert'

import {
  buildBearerValue,
  selectProxyAuthorizationHeader
} from '../src/utils/proxyAuthUtils.js'

assert.equal(buildBearerValue(''), '')
assert.equal(buildBearerValue('   '), '')
assert.equal(buildBearerValue('pbuf_user_abc'), 'Bearer pbuf_user_abc')
assert.equal(buildBearerValue('Bearer pbuf_user_abc'), 'Bearer pbuf_user_abc')

assert.equal(
  selectProxyAuthorizationHeader({ incomingAuthorization: 'Bearer from-client', apiToken: 'pbuf_user_env' }),
  'Bearer from-client'
)
assert.equal(
  selectProxyAuthorizationHeader({ incomingAuthorization: '', apiToken: 'pbuf_user_env' }),
  'Bearer pbuf_user_env'
)
assert.equal(
  selectProxyAuthorizationHeader({ incomingAuthorization: undefined, apiToken: '' }),
  ''
)

console.log('proxyAuthUtils: OK')
