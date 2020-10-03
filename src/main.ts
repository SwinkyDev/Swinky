import { Logger } from '@swinky/core/logger'
import * as fs from 'fs'

async function run () {
  const allFilesPackages = fs.readdirSync('././packages')
  for (const filePackage of allFilesPackages) {
    if (fs.lstatSync(`././packages/${filePackage}`).isDirectory()) {
      const plugins = fs
        .readdirSync(`././packages/${filePackage}`)
        .filter(name => name === 'plugin.js')
      for (const mainFile of plugins) {
        const main = require(`../packages/${filePackage}/${mainFile}`)
        main.run()
      }
    }
  }
}

run().catch(Logger.error)
