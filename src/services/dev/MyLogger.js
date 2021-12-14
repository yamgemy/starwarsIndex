import { appWideLog } from '../../enums'

//allows each component to turn off individually
const MyLogger = (isComponentLogging = false, componentName = '') => {
  return function (msg, lineNumber) {
    if (appWideLog && isComponentLogging) {
      const msgIsObj = typeof msg === 'object'
      const msgDisplay = msgIsObj ? JSON.stringify(msg) : msg
      console.log(`at ${componentName}:   ${msgDisplay} | line: ${lineNumber}`)
    }
  }
}

export default MyLogger

//usage:
//const devLog = MyLogger(true, 'componentName') //a new instance
//devLog('message', 10) //
