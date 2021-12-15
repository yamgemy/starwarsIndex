import React, { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import MyLogger from '../../services/dev/MyLogger'
const devLog = MyLogger(true, 'CharacterListItemSimple')

export default React.memo(({ charName, worldId }) => {
  const { world } = useSelector(({ homeWorldsReducer }) => ({
    world: homeWorldsReducer.homeworlds[worldId],
  }))

  useEffect(() => {
    if (world) {
      devLog(world.name, 14)
    }
  }, [world])

  return (
    <View style={sty.container}>
      <Text>{charName}</Text>
      <If condition={world !== undefined}>
        <Text>{world.name}</Text>
      </If>
    </View>
  )
})

const sty = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    flexDirection: 'row',
  },
})
