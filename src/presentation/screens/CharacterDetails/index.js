import React from 'react'
import { StyleSheet, View } from 'react-native'
import StarWarsAvatar from '../../components/StarWarsAvatar'

export default ({ route }) => {
  return (
    <View style={sty.container}>
      <StarWarsAvatar character={route.params} />
    </View>
  )
}

const sty = StyleSheet.create({
  container: { flex: 1 },
})
