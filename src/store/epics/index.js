import { combineEpics } from 'redux-observable'
import {
  requestCharactersEpic,
  requestCharactersSuccessEpic,
} from './charactersEpics'
import { requestAHomeWorldEpic } from './homeworldEpics'

export default RootEpic = combineEpics(
  requestCharactersEpic,
  requestCharactersSuccessEpic,
  requestAHomeWorldEpic,
)
