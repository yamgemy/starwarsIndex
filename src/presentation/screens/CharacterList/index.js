import React, { useEffect } from 'react'
import { View, FlatList } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { actionRequestCharacters } from '../../../store/actions/charactersActions'
import MyLogger from '../../../services/dev/MyLogger'
import CharacterListItemSimple from '../../components/CharacterListItemSimple'
const devLog = MyLogger(true, 'CharacterList')

export default () => {
  const dispatch = useDispatch()
  const { charactersArray } = useSelector(({ charactersReducer }) => ({
    charactersArray: Object.values(charactersReducer.characters),
  }))
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

  return (
    <View>
      <FlatList
        data={charactersArray}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
      />
    </View>
  )
}
