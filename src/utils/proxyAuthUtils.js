import { normalizeToken } from './authUtils.js'

export const buildBearerValue = (token) => {
  const normalized = normalizeToken(token)
  return normalized ? `Bearer ${normalized}` : ''
}

export const selectProxyAuthorizationHeader = ({ incomingAuthorization, apiToken }) => {
  if (incomingAuthorization) return String(incomingAuthorization)
  return buildBearerValue(apiToken)
}
