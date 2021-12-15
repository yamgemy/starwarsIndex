import { combineEpics } from 'redux-observable'
import {
  requestCharactersEpic,
  onRequestCharactersSuccessEpic,
} from './charactersEpics'
import { requestAHomeWorldEpic } from './homeworldEpics'

export default RootEpic = combineEpics(
  requestCharactersEpic,
  onRequestCharactersSuccessEpic,
  requestAHomeWorldEpic,
)
