import axios from 'axios'

// API calls should be proxied through a backend server to avoid exposing the authentication token
// The proxy server will add the Authorization header before forwarding requests to the actual API
const API_BASE_URL = '/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const metadataApi = {
  /**
   * Get metadata for a module
   * @param {string} name - Module name
   * @param {string} tag - Version tag
   * @returns {Promise<Object>} Metadata response with packages, proto files, messages, services
   */
  async getMetadata(name, tag) {
    const response = await apiClient.post('/v1/metadata', {
      name,
      tag
    })
    return response.data
  }
}
