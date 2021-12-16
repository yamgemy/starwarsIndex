import { serverConfigs } from '../../enums'
import {
  createRequestRetryPromise,
  createJwtTokenHeader,
} from '../axiosManager.js'
const { baseUrl, requireAccessToken } = serverConfigs

export const requestCharactersList = (page) => {
  const config = {
    method: 'GET',
    url: `${baseUrl}people/?page=${page}`,
    headers: requireAccessToken ? createJwtTokenHeader() : null,
    requireAccessToken: requireAccessToken,
  }
  return createRequestRetryPromise(config, 2)
}
