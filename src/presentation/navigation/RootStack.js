import React, { useCallback, useEffect, useState } from 'react'
//import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import { createStackNavigator } from '@react-navigation/stack'
import CharacterDetails from '../screens/CharacterDetails'
import CharacterList from '../screens/CharacterList'
//const SharedElementStack = createSharedElementStackNavigator()
const Stack = createStackNavigator()

export default () => {
  return (
    <Stack.Navigator headerMode={'none'} initialRouteName={'CharacterList'}>
      <Stack.Screen name='CharacterList' component={CharacterList} />
      <Stack.Screen name='CharacterDetails' component={CharacterDetails} />
    </Stack.Navigator>
  )
}
