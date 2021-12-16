import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Avatar } from 'react-native-nice-avatar'
import resources from '../../assets/avatarResourcesMap.json'

export default React.memo(
  ({ character }) => {
    const { name, gender, hair_color, skin_color } = character
    return (
      <View style={sty.container}>
        <Avatar
          size={200}
          gender={gender}
          eyeType={resources.eyeType[gender]}
          skinColor={resources.skinColors[skin_color]}
          hairType={resources.hairTypes[gender]}
          hairColor={resources.hairColors[hair_color]}
        />
      </View>
    )
  },
  (prev, next) => {
    if (prev.character.id === next.character.id) {
      return true
    }
  },
)

const sty = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 30,
  },
})
