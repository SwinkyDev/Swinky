import { CommandDispatcher } from '@swinky/core/command'
import { Logger } from '@swinky/core/logger'
import { VK } from 'vk-io'
import * as config from '../../config.json'

const vk: VK = new VK({
  token: config.vk_token,
  pollingGroupId: config.vk_group_id,
  apiMode: 'parallel'
})

module.exports.run = async () => {
  Logger.info('Started VK API plugin!')

  vk.updates.startPolling()
  vk.updates.on('message', message => {
    if (message.isOutbox) return

    if (!message.text.startsWith(config.command_prefix)) {
      return
    }

    const command = message.text
      .replace(config.command_prefix, '')
      .split(' ')
      .shift()

    if (CommandDispatcher.get().contains(command)) {
      const swinkyCommand = CommandDispatcher.get().get(command)
      const context = swinkyCommand.parse(
        message.text,
        message.senderId,
        message
      )
      swinkyCommand.dispatch(context)
    }
  })
}
