import axios from 'axios'
import { serverConfigs } from '../../enums'
import MyLogger from '../dev/MyLogger'
const devLog = MyLogger(true, 'axiosManager')

const createCancelConfigs = () => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()
  return {
    source: source,
    config: {
      cancelToken: source.token,
    },
  }
}

//this purpse of this function is to handle timeout and customize request error handling
const configureAxios = () => {
  const instance = axios.create()

  instance.defaults.timeout = serverConfigs.myRequestTimeout

  instance.interceptors.response.use(
    function (response) {
      //todo map key etc
      return response
    },
    function (error) {
      const { status, message } = error.toJSON()
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
    //when app requires auth and user isnt signed in
    return Promise.reject({ status: 400 })
  }

  if (totalTries <= 0) {
    return Promise.reject({ status: 503 }) //use case: server down + request timeout
  }

  return new Promise(async (mainResolve, mainReject) => {
    //the cancel token must be unique to each axios call, otherwise timeout does not work on retries
    const { source, config } = createCancelConfigs()
    const combinedConfig = { ...defaultConfig, ...config }
    try {
      const result = await anAxiosInstance(combinedConfig) //result is also available in intercepter
      mainResolve(Promise.resolve(result)) //this goes into the from(...) function inside epics
    } catch (e) {
      if (e.status !== 503) {
        //pass an object instead of Promise because catchError(e) block deals with object
        mainReject(e)
        return
      }
      source.cancel('previous axios requst cancelled on timeout')
      mainReject(retryAxiosPromise(defaultConfig, totalTries - 1))
    }
  })
}

//import { store } from '../../store'
const createJwtTokenHeader = () => {
  // const { currentUser } = store.getState().currentUserReducer
  // const accessToken = currentUser !== null ? currentUser.auth.bearer : undefined
  // return accessToken
  //   ? {
  //       'x-access-token': `Bearer ${accessToken}`,
  //     }
  //   : undefined
  return null
}

module.exports = {
  createRequestRetryPromise,
  createJwtTokenHeader,
}
