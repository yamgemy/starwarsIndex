import React, { useEffect, useContext } from 'react'
import { View, Text, StyleSheet, TouchableNativeFeedback } from 'react-native'
import { useSelector } from 'react-redux'
import Spinner from 'react-native-spinkit'
import { navigate } from '../navigation/navigator'
import MyLogger from '../../services/dev/MyLogger'
const devLog = MyLogger(true, 'CharacterListItemSimple')

export default React.memo(
  ({ character, worldId }) => {
    const { world } = useSelector(({ homeWorldsReducer }) => ({
      world: homeWorldsReducer.homeworlds[worldId],
    }))

    const onCharPressed = () => {
      navigate('CharacterDetails', character)
    }

    return (
      <View style={sty.pressable}>
        <TouchableNativeFeedback style={sty.pressable} onPress={onCharPressed}>
          <View style={sty.container}>
            <View style={sty.top}>
              <Text style={sty.name}>{character.name}</Text>
            </View>
            <View style={sty.bottom}>
              <Text style={sty.world}>Homeworld:</Text>
              <If condition={world !== undefined}>
                <Text>{world.name}</Text>
              </If>
              <If condition={!world}>
                <Spinner
                  style={sty.spinner}
                  size={30}
                  type={'ChasingDots'}
                  color={'#ACFD80'}
                />
              </If>
            </View>
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  },
  (prev, next) => {
    return true
  },
)

const sty = StyleSheet.create({
  pressable: {
    overflow: 'hidden',
    borderRadius: 10,
  },
  container: {
    height: 80,
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: '3%',
    marginBottom: '3%',
    padding: 10,
    width: '94%',
  },
  top: {
    flex: 1,
  },
  bottom: { flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' },
  spinner: {
    // height: 35, width:35
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  world: {
    fontSize: 11,
  },
})
