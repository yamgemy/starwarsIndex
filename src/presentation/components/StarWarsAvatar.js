import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Avatar } from 'react-native-nice-avatar'
import resources from '../../assets/avatarResourcesMap.json'
import MyLogger from '../../services/dev/MyLogger'
const devLog = MyLogger(true, 'StarWarsAvatar')
//hair  ["none","blond","brown","black","n/a","white","auburn",
//"auburn, white","brown, grey","grey","auburn, grey","blonde"]

//skin ["fair","gold","white, blue","white","light",

//"white, red","unknown","green",

//"green-tan, brown","pale","metal","dark","brown mottle"
//,"brown","grey","mottled green","orange","blue, grey","grey, red","red","blue","grey, blue",
//"grey, green, yellow","yellow","tan","fair, green, yellow","silver, red","green, grey",
//"red, blue, white","brown, white","none"]

//eye colors  ["blue","yellow","red","brown","blue-gray",
//"black","orange","hazel","pink","unknown","red, blue","gold","green, yellow","white","dark"]

//gender ["male","female","none","n/a","hermaphrodite"]

export default ({ character }) => {
  const { name, gender, hair_color, eye_color, skin_color } = character

  devLog(resources.hairColors['blond'], 18)
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
}

const sty = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 30,
  },
})
