import * as config from '../../config.json'
import { Client } from 'discord.js'
import { Logger } from '@swinky/core/logger'
import { CommandDispatcher } from '@swinky/core/command'

const client: Client = new Client()
client.login(config.discord_token)

client.on('ready', () => {
  Logger.info('Discord API connected')
})

export function getDiscordClient (): Client {
  return client
}

module.exports.run = async () => {
  Logger.info('Started Discord API plugin!')

  client.on('message', message => {
    if (message.author.bot) return

    if (!message.content.startsWith(config.command_prefix)) {
      return
    }

    const command = message.content
      .replace(config.command_prefix, '')
      .split(' ')
      .shift()

    if (CommandDispatcher.get().contains(command)) {
      const swinkyCommand = CommandDispatcher.get().get(command)
      const context = swinkyCommand.parse(
        message.content,
        message.member.id,
        message
      )
      swinkyCommand.dispatch(context)
    }
  })
}
