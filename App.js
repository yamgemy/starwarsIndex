import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistedStore, store } from './src/store'
import Navigation from './src/presentation/navigation'

const App = () => {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
        <Navigation />
      </PersistGate>
    </ReduxProvider>
  )
}

export default App
