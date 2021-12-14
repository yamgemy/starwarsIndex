import React, { useEffect } from 'react'
//import {StatusBar} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import RootStack from './RootStack'

export let navigationContext = null

export default () => {
  const navigationRef = React.useRef()

  const onNavigationReady = () => {
    navigationContext = React.createContext({ navigationRef })
  }

  return (
    <NavigationContainer ref={navigationRef} onReady={onNavigationReady}>
      <SafeAreaProvider>
        <RootStack />
      </SafeAreaProvider>
    </NavigationContainer>
  )
}
