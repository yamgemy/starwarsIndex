import uniqBy from 'lodash/uniqBy'
import MyLogger from '../dev/MyLogger'
const devLog = MyLogger(true, 'dataParser')

export const getIdFromUrl = (url) => {
  //assumes all targetProp is a string url ending with '/'
  const keyChoices = url.split('/')
  const key = keyChoices[keyChoices.length - 2]
  return parseInt(key) || -1
}

export const normalizeArrayOfObjects = (ObjsArray, targetProp) => {
  const normalized = ObjsArray.reduce((accu, item) => {
    try {
      const testedKey = item['id'] ? item['id'] : getIdFromUrl(item[targetProp])
      //implicitly skips an item if the targetProp is corrupt
      return testedKey !== -1
        ? { ...accu, [testedKey]: { ...item, id: testedKey } }
        : accu
    } catch (e) {
      //only catch errors before testedKey
      throw new Error('error normalizing target data')
    }
  }, {})
  return normalized
}

export const getUniqueArrayOfObjects = (ObjsArray, targetProp) => {
  return uniqBy(ObjsArray, targetProp)
}

export const sortArrayByItemName = (targetArray) => {
  return targetArray.sort((a, b) => a.name.localeCompare(b.name))
}
