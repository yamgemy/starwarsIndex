import { HOMEWORLDS_TYPE as TYPE } from '../types'
import { ofType } from 'redux-observable'
import {
  from,
  mergeMap,
  concatMap,
  of,
  switchMap,
  debounceTime,
  concat,
  merge,
} from 'rxjs'
import { map, catchError, finalize, delay } from 'rxjs/operators'
import { requestAHomeWorld } from '../../services/api/homeworlds'
import { createMultipleRequestsPromise } from '../../services/axiosManager.js'
import {
  actionOnRequestAHomeworldSuccess,
  actionOnRequestMultipleWorldsSuccess,
} from '../actions/homeworldsActions'
import { onRequestFailed } from '../actions/generalActions'
import { getUniqueArrayOfObjects } from '../../services/dataParser.js'
import MyLogger from '../../services/dev/MyLogger'
const devLog = MyLogger(true, 'homeworldEpics')

//not in use
const requestAHomeWorldEpic = (action$, state$) => {
  return action$.pipe(
    ofType(TYPE.REQUEST_HOMEWORLD),
    mergeMap((action) => {
      const worldId = action.payload
      return from(requestAHomeWorld(worldId)).pipe(
        map((result) => {
          const { data } = result
          devLog(data.name, 26)
          return actionOnRequestAHomeworldSuccess(worldId, data)
        }), //end map
        catchError((e) => {
          devLog(e, 36)
          return of(onRequestFailed(action, e))
        }),
      ) //end 2nd pipe
    }),
  )
}

//in use
const requestMultipleWorldsEpic = (action$, state$) => {
  return action$.pipe(
    ofType(TYPE.REQUEST_MULTI_HOMEWORLDS),
    mergeMap((action) => {
      const { homeworlds } = state$.value.homeWorldsReducer
      const uniqueWorldsRequests = getUniqueArrayOfObjects(
        action.payload,
        'worldId',
      ).reduce((accu, item) => {
        if (!homeworlds[item.worldId]) {
          return [...accu, requestAHomeWorld(item.worldId)]
        } else {
          return accu
        }
      }, [])
      return from(Promise.all(uniqueWorldsRequests)).pipe(
        map((resultsArr) => {
          const worlds = resultsArr.map((item) => item.data)
          return actionOnRequestMultipleWorldsSuccess(worlds)
        }),
        catchError((e) => {
          devLog(e, 72)
          return of(onRequestFailed(action, e))
        }),
      )
    }),
  )
}

module.exports = { requestAHomeWorldEpic, requestMultipleWorldsEpic }
