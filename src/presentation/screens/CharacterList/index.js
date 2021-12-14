import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'
import { actionRequestCharacters } from '../../../store/actions/charactersActions'
export default () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(actionRequestCharacters())
  }, [])
  return <View />
}
