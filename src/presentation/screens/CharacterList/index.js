import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { actionRequestCharacters } from '../../../store/actions/charactersActions'

export default () => {
  const dispatch = useDispatch()
  const { characters } = useSelector(({ charactersReducer }) => ({
    characters: charactersReducer.characters,
  }))
  useEffect(() => {
    dispatch(actionRequestCharacters())
  }, [])

  useEffect(() => {
    console.log(Object.keys(characters))
  }, [characters])

  return <View />
}
