import { serverConfigs } from '../../enums'
import {
  createRequestRetryPromise,
  createJwtTokenHeader,
} from '../axiosManager.js'
const { baseUrl, requireAccessToken } = serverConfigs
import MyLogger from '../dev/MyLogger'
const devLog = MyLogger(true, 'homeworld API')

export const requestAHomeWorld = (worldId) => {
  const config = {
    method: 'GET',
    url: `${baseUrl}planets/${worldId}/`,
    headers: requireAccessToken ? createJwtTokenHeader() : null,
    requireAccessToken: requireAccessToken,
  }
  devLog(config, 16)
  return createRequestRetryPromise(config, 2)
}
