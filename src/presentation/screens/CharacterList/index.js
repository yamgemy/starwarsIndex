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
  const { flatListData = [], endOfPages = false } = useSelector(
    ({ charactersReducer, generalReducer }) => {
      const charactersArray = Object.values(charactersReducer.characters)
      const endOfPages =
        generalReducer.failedRequests[`${TYPE.REQUEST_CHARACTERS}404`]
      return {
        endOfPages,
        flatListData: doSort
          ? sortArrayByItemName(charactersArray) //runs everytime data changes while in sort mode
          : charactersArray,
      }
    },
  )

  const renderItem = ({ item }) => (
    <CharacterListItemSimple character={item} worldId={item.worldId} />
  )

  const renderFooter = React.memo(() => {
    return (
      <View style={sty.footer}>
        <Spinner
          type={'Wave'}
          size={28}
          color={'yellow'}
          isVisible={!endOfPages}
        />
      </View>
    )
  })

  const onEndReached = React.useCallback(
    ({ distanceFromEnd }) => {
      devLog(distanceFromEnd, 25)
      if (endOfPages === false) {
        dispatch(actionRequestCharacters())
      }
    },
    [endOfPages],
  )

  const onSortPressed = React.useCallback(() => {
    setDoSort((prev) => !prev)
  }, [])

  const extractKey = React.useCallback((item) => item.id, [])

  useEffect(() => {
    dispatch(actionRequestCharacters())
  }, [])

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
        <If condition={flatListData.length > 0}>
          <FlatList
            data={flatListData}
            renderItem={renderItem}
            keyExtractor={extractKey}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.2}
            ListFooterComponent={renderFooter}
          />
        </If>
        <If condition={flatListData.length === 0}>
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
