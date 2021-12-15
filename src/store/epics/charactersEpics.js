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
  merge,
} from 'rxjs'
import { map, catchError, finalize, delay } from 'rxjs/operators'
import { requestCharactersList } from '../../services/api/characters'
import { onRequestFailed } from '../actions/generalActions'
import { actionOnRequestCharactersSuccess } from '../actions/charactersActions'
import { actionRequestAHomeworld } from '../actions/homeworldsActions'
import {
  getIdFromUrl,
  getUniqueArrayOfObjects,
} from '../../services/dataParser.js'
import MyLogger from '../../services/dev/MyLogger'
const devLog = MyLogger(true, 'charactersEpics')

const requestCharactersEpic = (action$, state$) => {
  return action$.pipe(
    ofType(TYPE.REQUEST_CHARACTERS),
    debounceTime(500), //prevents firing duplicate request
    switchMap((action) => {
      const { pages } = state$.value.charactersReducer
      return from(requestCharactersList(pages + 1)).pipe(
        concatMap((result) => {
          //attaches new data after previous order completes
          const { data } = result
          const charsWithWorldIds = data.results.map((char) => {
            const worldId = getIdFromUrl(char['homeworld'])
            return { ...char, worldId: worldId }
          })
          return of(actionOnRequestCharactersSuccess(charsWithWorldIds))
        }),
        catchError((e) => {
          devLog(e, 36)
          return of(onRequestFailed(action))
        }),
      )
    }),
  )
}

const onRequestCharactersSuccessEpic = (action$, state$) => {
  return action$.pipe(
    ofType(TYPE.REQUEST_CHARS_SUCCESS),
    mergeMap((action) => {
      //action.payload is a characters list
      const { homeworlds } = state$.value.homeWorldsReducer
      const actionsOfRequestWorlds = action.payload.reduce((todos, char) => {
        const { worldId } = char
        if (worldId !== -1 && !homeworlds[worldId]) {
          return [...todos, actionRequestAHomeworld(worldId)]
        } else {
          return todos
        }
      }, [])

      const uniqueActions = getUniqueArrayOfObjects(
        actionsOfRequestWorlds,
        'payload',
      )
      return merge(uniqueActions).pipe(
        //instead of concat
        catchError((e) => {
          devLog(e, 64)
          return of(onRequestFailed(action))
        }),
      )
    }),
  )
}

module.exports = { requestCharactersEpic, onRequestCharactersSuccessEpic }
