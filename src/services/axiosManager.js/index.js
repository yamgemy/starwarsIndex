import axios from 'axios'
import { serverConfigs } from '../../enums'

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
        return Promise.reject({ status: 503, timeout: true }) //arbitrary payload
      }
      return Promise.reject(error) //everything else
    },
  )
  return instance
}

//this is currently set to retry only when server gives absolutely no response
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
    const anAxiosInstance = configureAxios()
    try {
      const result = await anAxiosInstance({ ...defaultConfig, ...config })
      mainResolve(Promise.resolve(result)) //this goes into the from(...) function inside epics
    } catch (e) {
      if (e.status === 503 && e.timeout) {
        source.cancel('previous axios requst cancelled on timeout')
        mainReject(retryAxiosPromise(defaultConfig, totalTries - 1))
        return
      }
      mainReject(e) //pass an object instead of Promise because catchError(e) block deals with object
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
