import axios from 'axios'
import { serverConfigs } from '../../enums/index'
import MyLogger from '../dev/MyLogger'
const devLog = MyLogger(true, 'axiosManager')
const createCancelConfigs = () => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()
  return {
    source: source,
    config: {
      cancelToken: source.token,
      timeout: serverConfigs.myRequestTimeout, //this overrides instance.defaults.timout
    },
  }
}

const configureAxios = () => {
  const instance = axios.create()

  instance.defaults.timeout = 2000 // serverConfigs.myRequestTimeout

  instance.interceptors.response.use(
    function (response) {
      //todo map key etc
      return response
    },
    function (error) {
      const { status, message } = error.toJSON() //sometimes error dont have response prop
      //must use reject: this falls into the retryAxiosPromise catch block
      if (status === null && message.includes('timeout')) {
        return Promise.reject({ status: 503 }) //arbitrary payload
      }
      return Promise.reject(error) //everything else
    },
  )
  return instance
}

//axios instance DON'T need to be unique per axios call
const anAxiosInstance = configureAxios()

const createRequestRetryPromise = (
  defaultConfig,
  totalTries = serverConfigs.defaultTotalAxiosTries,
) => {
  if (
    defaultConfig.headers !== null &&
    defaultConfig.requireAccessToken === true
  ) {
    //when headers dont exist (user got logged out), dont even post the request
    return Promise.reject({ status: 400 })
  }

  if (totalTries <= 0) {
    return Promise.reject({ status: 503 }) //my node server down
  }

  return new Promise(async (mainResolve, mainReject) => {
    //the cancel token must be unique to each axios call, otherwise timeout does not work on retries
    const { source, config } = createCancelConfigs()
    const combinedConfig = { ...defaultConfig, ...config }
    try {
      const result = await anAxiosInstance(combinedConfig) //result is already logged by intercepter
      mainResolve(Promise.resolve(result)) //you pass a promise containing resolved value back inside epics' from(...)
    } catch (e) {
      if (e.status !== 503) {
        mainReject(e) //let epics handle specific cases in the catchError block
        return //you pass an object back because catch(e) block requires no promise
      }
      source.cancel('previous axios requst cancelled on timeout')
      mainReject(retryAxiosPromise(defaultConfig, totalTries - 1))
    }
  })
}

import { store } from '../../store'
const createJwtTokenHeader = () => {
  const { currentUser } = store.getState().currentUserReducer
  const accessToken = currentUser !== null ? currentUser.auth.bearer : undefined
  return accessToken
    ? {
        'x-access-token': `Bearer ${accessToken}`,
      }
    : undefined
}

module.exports = {
  createRequestRetryPromise,
  createJwtTokenHeader,
}
