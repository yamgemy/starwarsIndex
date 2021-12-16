import React from 'react'
//import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack'

import CharacterDetails from '../screens/CharacterDetails'
import CharacterList from '../screens/CharacterList'
//const SharedElementStack = createSharedElementStackNavigator()
const Stack = createStackNavigator()

export default () => {
  return (
    <Stack.Navigator
      initialRouteName={'CharacterList'}
      screenOptions={{
        presentation: 'card',
      }}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name='CharacterList'
        component={CharacterList}
      />
      <Stack.Screen
        name='CharacterDetails'
        component={CharacterDetails}
        options={({ route }) => ({
          title: route.params.name,
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: '#1370AD', height: 40 },
          headerTitleStyle: { color: 'white' },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        })}
      />
    </Stack.Navigator>
  )
}
