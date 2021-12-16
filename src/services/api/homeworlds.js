import { serverConfigs } from '../../enums'
import {
  createRequestRetryPromise,
  createJwtTokenHeader,
} from '../axiosManager.js'
const { baseUrl, requireAccessToken } = serverConfigs

export const requestAHomeWorld = (worldId) => {
  const config = {
    method: 'GET',
    url: `${baseUrl}planets/${worldId}/`,
    headers: requireAccessToken ? createJwtTokenHeader() : null,
    requireAccessToken: requireAccessToken,
  }
  return createRequestRetryPromise(config, 2)
}
