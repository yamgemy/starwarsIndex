import React, { useEffect } from 'react'
//import {StatusBar} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import RootStack from './RootStack'
import { navigationRef } from './navigator'

export default () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <SafeAreaProvider>
        <RootStack />
      </SafeAreaProvider>
    </NavigationContainer>
  )
}
