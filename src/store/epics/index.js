import { combineEpics } from 'redux-observable'
import { requestCharactersEpic } from './charactersEpics'

export default RootEpic = combineEpics(requestCharactersEpic)
