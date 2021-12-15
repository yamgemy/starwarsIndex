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
} from 'rxjs'
import { map, catchError, finalize, delay } from 'rxjs/operators'
import { requestAHomeWorld } from '../../services/api/homeworlds'
import { actionOnRequestAHomeworldSuccess } from '../actions/homeworldsActions'
import { onRequestFailed } from '../actions/generalActions'
import MyLogger from '../../services/dev/MyLogger'
const devLog = MyLogger(true, 'homeworldEpics')

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
          return of(onRequestFailed(action))
        }),
      ) //end 2nd pipe
    }),
  )
}

module.exports = { requestAHomeWorldEpic }
