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
import { CHARACTERS_TYPES as TYPE } from '../../../store/types'
import Spinner from 'react-native-spinkit'
const devLog = MyLogger(true, 'CharacterList')
const sortIcon = require('../../../assets/sortAZ.png')

export default () => {
  const dispatch = useDispatch()
  const [doSort, setDoSort] = useState(false)
  const { charactersArray = [], endReached = false } = useSelector(
    ({ charactersReducer, generalReducer }) => {
      const flatListdata = Object.values(charactersReducer.characters)
      const endReached =
        -1 !==
        generalReducer.failedRequests.findIndex(
          (item) => item.type === TYPE.REQUEST_CHARACTERS && 'error' in item,
        )
      return {
        endReached,
        charactersArray: doSort
          ? sortArrayByItemName(flatListdata) //runs everytime data changes while in sort mode
          : flatListdata,
      }
    },
  )

  useEffect(() => {
    dispatch(actionRequestCharacters())
  }, [])

  const renderItem = ({ item }) => {
    return <CharacterListItemSimple character={item} worldId={item.worldId} />
  }

  const renderFooter = React.memo(() => {
    return (
      <View style={sty.footer}>
        <Spinner
          type={'Wave'}
          size={28}
          color={'yellow'}
          isVisible={!endReached}
        />
      </View>
    )
  })

  const onEndReached = ({ distanceFromEnd }) => {
    devLog(distanceFromEnd, 25)
    if (endReached === false) {
      dispatch(actionRequestCharacters())
    }
  }

  const onSortPressed = () => {
    setDoSort((prev) => !prev)
  }

  return (
    <View style={sty.container}>
      <View style={sty.topPanel}>
        <Text style={sty.panelTitle}>Star Wars Characters</Text>
        <TouchableOpacity style={sty.sortBtn(doSort)} onPress={onSortPressed}>
          <Image
            source={sortIcon}
            style={sty.sortIcon}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      </View>
      <View style={sty.list}>
        <If condition={charactersArray.length > 0}>
          <FlatList
            data={charactersArray}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.2}
            ListFooterComponent={renderFooter}
          />
        </If>
        <If condition={charactersArray.length === 0}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Spinner size={130} type={'Pulse'} color={'#6FF0FF'} />
          </View>
        </If>
      </View>
    </View>
  )
}

const sty = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#37616F',
  },
  topPanel: {
    backgroundColor: '#2A494D',
    //height: '5%',
    height: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  sortBtn: function (sorting) {
    return {
      width: 30,
      margin: 5,
      backgroundColor: sorting ? '#ACFD80' : 'transparent',
      position: 'absolute',
      top: 0,
      right: 0,
    }
  },
  sortIcon: { height: 30, width: 30 },
  list: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    marginTop: '3%',
  },
  footer: {
    height: 50,
    backgroundColor: 'transparent',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
