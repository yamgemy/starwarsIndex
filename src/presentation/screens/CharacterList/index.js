import React, { useEffect, useState } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { actionRequestCharacters } from '../../../store/actions/charactersActions'
import MyLogger from '../../../services/dev/MyLogger'
import CharacterListItemSimple from '../../components/CharacterListItemSimple'
import { sortArrayByItemName } from '../../../services/dataParser.js'
const devLog = MyLogger(true, 'CharacterList')
const sortIcon = require('../../../assets/sortAZ.png')

export default () => {
  const dispatch = useDispatch()
  const [doSort, setDoSort] = useState(false)
  const { charactersArray } = useSelector(({ charactersReducer }) => {
    const flatListdata = Object.values(charactersReducer.characters)
    return {
      charactersArray: doSort
        ? sortArrayByItemName(flatListdata) //runs everytime data changes while in sort mode
        : flatListdata,
    }
  })

  useEffect(() => {
    dispatch(actionRequestCharacters())
  }, [])

  const renderItem = ({ item }) => {
    return (
      <CharacterListItemSimple charName={item.name} worldId={item.worldId} />
    )
  }

  const onEndReached = ({ distanceFromEnd }) => {
    devLog(distanceFromEnd, 25)
    dispatch(actionRequestCharacters())
  }

  const onSortPressed = () => {
    setDoSort((prev) => !prev)
  }

  return (
    <View style={sty.container}>
      <View style={sty.topPanel}>
        <TouchableOpacity style={sty.sortBtn(doSort)} onPress={onSortPressed}>
          <Image
            source={sortIcon}
            style={sty.sortIcon}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      </View>
      <View style={sty.list}>
        <FlatList
          data={charactersArray}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.2}
        />
      </View>
    </View>
  )
}

const sty = StyleSheet.create({
  container: { flex: 1 },
  topPanel: {
    backgroundColor: 'grey',
    //height: '5%',
    height: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  sortBtn: function (sorting) {
    return { width: 30, backgroundColor: sorting ? '#ACFD80' : 'white' }
  },
  sortIcon: { height: 30, width: 30 },
  // list: { height: '95%' },
})
