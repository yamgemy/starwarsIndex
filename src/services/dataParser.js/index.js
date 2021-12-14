export const normalizeArrayOfObjects = (dataArray, targetProp) => {
  //assumes all targetProp is a string url ending with '/'
  const normalized = dataArray.reduce((accu, item) => {
    try {
      const keySource = item[targetProp]
      const keyChoices = keySource.split('/')
      const key = keyChoices[keyChoices.length - 2]
      const testedKey = parseInt(key) || -1
      //implicitly skips an item if the targetProp is corrupt
      return testedKey !== -1 ? { ...accu, [testedKey]: item } : accu
    } catch (e) {
      //only catch errors before testedKey
      throw new Error('error normalizing target data')
    }
  }, {})
  return normalized
}
