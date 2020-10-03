export class Logger {
  static info (message) {
    Logger.log('INFO', message)
  }

  static warn (message) {
    Logger.log('WARN', message)
  }

  static error (message) {
    Logger.log('ERROR', message)
  }

  static log (level, message) {
    const date = new Date()
    const formatted = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    console.log(`[${level}] [${formatted}] ${message}`)
  }
}
