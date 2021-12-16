import { createEpicMiddleware } from 'redux-observable'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { persistStore, persistReducer } from 'redux-persist'
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1'
import { homeWorldsReducer } from './reducers/homeWorldsReducer'
import { charactersReducer } from './reducers/charactersReducer'
import { generalReducer } from './reducers/generalReducer'
import RootEpic from './epics/index'

const epicMiddleware = createEpicMiddleware()

const rootReducer = combineReducers({
  generalReducer,
  charactersReducer,
  homeWorldsReducer,
})

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel1,
  blacklist: ['charactersReducer', 'homeWorldsReducer', 'generalReducer'],
}

const persistedRootReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(
  persistedRootReducer,
  composeWithDevTools(applyMiddleware(epicMiddleware)),
)

export let persistedStore = persistStore(store)

epicMiddleware.run(RootEpic)
