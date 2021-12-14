import { serverConfigs } from '../../enums'
import {
  createRequestRetryPromise,
  createJwtTokenHeader,
} from '../axiosManager.js'
const { baseUrl, requireAccessToken } = serverConfigs
import MyLogger from '../dev/MyLogger'
const devLog = MyLogger(true, 'characters API')

export const requestCharactersList = (page) => {
  const config = {
    method: 'GET',
    url: `${baseUrl}people/?page=${page}`,
    headers: requireAccessToken ? createJwtTokenHeader() : null,
    requireAccessToken: requireAccessToken,
  }
  devLog(config, 16)
  return createRequestRetryPromise(config, 2)
}
