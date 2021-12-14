import { CHARACTERS_TYPES as TYPE } from '../types'
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
import { requestCharactersList } from '../../services/api/characters'
import MyLogger from '../../services/dev/MyLogger'
const devLog = MyLogger(true, 'charactersEpics')
import { onRequestFailed } from '../actions/generalActions'
import { actionOnRequestCharactersSuccess } from '../actions/charactersActions'

const requestCharactersEpic = (action$, state$) => {
  return action$.pipe(
    ofType(TYPE.REQUEST_CHARACTERS),
    debounceTime(500),
    switchMap((action) => {
      const curentPage = state$.value.charactersReducer.pages
      return from(requestCharactersList(curentPage + 1)).pipe(
        map((result) => {
          const { data } = result
          //todo fetch many homeworlds
          return actionOnRequestCharactersSuccess(data.results)
        }),
        catchError((e) => {
          devLog(e, 36)
          return of(onRequestFailed(action))
        }),
      )
    }),
  )
}

module.exports = { requestCharactersEpic }
