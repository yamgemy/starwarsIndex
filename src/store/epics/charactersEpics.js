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
import { map, catchError } from 'rxjs/operators'
import { requestCharactersList } from '../../services/api/characters'
import { onRequestFailed } from '../actions/generalActions'
import { actionOnRequestCharactersSuccess } from '../actions/charactersActions'
import { actionRequestMultipleWorlds } from '../actions/homeworldsActions'
import { getIdFromUrl } from '../../services/dataParser.js'

const requestCharactersEpic = (action$, state$) => {
  return action$.pipe(
    ofType(TYPE.REQUEST_CHARACTERS),
    debounceTime(300),
    switchMap((action) => {
      const { pages } = state$.value.charactersReducer
      return from(requestCharactersList(pages + 1)).pipe(
        mergeMap((result) => {
          //attaches new data after previous order completes
          const { data } = result
          const charsWithWorldIds = data.results.map((char) => {
            const worldId = getIdFromUrl(char['homeworld'])
            return { ...char, worldId: worldId }
          })
          return concat([
            actionOnRequestCharactersSuccess(charsWithWorldIds),
            actionRequestMultipleWorlds(charsWithWorldIds),
          ])
        }),
        catchError((e) => {
          return of(onRequestFailed(action, e))
        }),
      )
    }),
  )
}

module.exports = { requestCharactersEpic }
