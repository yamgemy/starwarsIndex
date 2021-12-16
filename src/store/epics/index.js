import { combineEpics } from 'redux-observable'
import { requestCharactersEpic } from './charactersEpics'
import {
  requestAHomeWorldEpic,
  requestMultipleWorldsEpic,
} from './homeworldEpics'

export default RootEpic = combineEpics(
  requestCharactersEpic,
  requestMultipleWorldsEpic,
  requestAHomeWorldEpic,
)
