import test from 'node:test'
import assert from 'node:assert/strict'

import { selectProxyAuthorizationHeader } from '../src/utils/proxyAuthUtils.js'

test('selectProxyAuthorizationHeader: prefers incoming Authorization header', () => {
  const result = selectProxyAuthorizationHeader({
    incomingAuthorization: 'Bearer from-browser',
    apiToken: 'pbuf_user_from_env',
    publicEnabled: false
  })

  assert.equal(result, 'Bearer from-browser')
})

test('selectProxyAuthorizationHeader: falls back to API token only in public mode', () => {
  const result = selectProxyAuthorizationHeader({
    incomingAuthorization: '',
    apiToken: 'pbuf_user_from_env',
    publicEnabled: true
  })

  assert.equal(result, 'Bearer pbuf_user_from_env')
})

test('selectProxyAuthorizationHeader: does not fall back to API token in private mode', () => {
  const result = selectProxyAuthorizationHeader({
    incomingAuthorization: '',
    apiToken: 'pbuf_user_from_env',
    publicEnabled: false
  })

  assert.equal(result, '')
})
