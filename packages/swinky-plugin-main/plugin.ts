import {
  ArgumentParser,
  CommandContext,
  CommandDispatcher,
  SwinkyCommand
} from '@swinky/core/command'
import { Logger } from '@swinky/core/logger'
import * as config from '../../config.json'
import { Message } from 'discord.js'
import { MessageContext } from 'vk-io'

export async function commandNotFound (
  context: Message | MessageContext<Record<string, any>>
) {
  var builder = 'Неизвестная команда.\nВозможно вы имели ввиду:\n\n'
  CommandDispatcher.get().asMap.forEach(command => {
    builder += `${command.name}, `
  })
  builder = builder.trim()
  builder = builder.slice(0, -1)

  if (context instanceof Message) {
    context.channel.send(builder)
  } else {
    context.send(builder)
  }
}

class HelpCommand extends SwinkyCommand {
  argumentParserWithoutContext (): ArgumentParser {
    return null
  }
  argumentParser (): ArgumentParser {
    return null
  }

  constructor () {
    super('help')
  }

  dispatch (context: CommandContext) {
    var builder = '\n'
    CommandDispatcher.get().asMap.forEach((command, name) => {
      if (command.argumentParserWithoutContext()) {
        builder += `${config.command_prefix}${name}`
        for (const argument of command.argumentParserWithoutContext().array) {
          builder += ` <${argument}>`
        }
        builder += ` - ${command.description()}\n`
      } else {
        builder += `/${name} - ${command.description()}\n`
      }
    })

    if (context.discordContext) {
      context.discordContext.reply(builder)
    } else {
      context.vkContext.send(builder)
    }
  }
  description (): string {
    return 'Помощь по командам'
  }
}

class AboutCommand extends SwinkyCommand {
  argumentParserWithoutContext (): ArgumentParser {
    return null
  }
  argumentParser (context: CommandContext): ArgumentParser {
    return null
  }

  constructor () {
    super('about')
  }

  dispatch (context: CommandContext) {
    if (context.discordContext) {
      context.discordContext.reply('Бот Swinky. Автор: kdevmc')
    } else {
      context.vkContext.send('Бот Swinky. Автор: kdevmc')
    }
  }
  description (): string {
    return 'Информация о боте'
  }
}

class ArgumentEchoCommand extends SwinkyCommand {
  argumentParserWithoutContext (): ArgumentParser {
    return new ArgumentParser(null, true, 'Аргумент', 'Аргументы')
  }
  constructor () {
    super('argument-echo')
  }
  dispatch (context: CommandContext) {
    if (context.arguments.length < 2) {
      this.send(context, 'Аргументов должно быть >= 2')
      return
    }

    this.argumentParser(context).thenArgument('Аргумент', value => {
      this.send(context, `Аргумент: ${value}`)
    })

    this.argumentParser(context).thenArgument('Аргументы', value => {
      this.send(context, `Аргументы: ${value}`)
    })
  }
  private send (context, message) {
    if (context.discordContext) {
      context.discordContext.reply(message)
    } else {
      context.vkContext.send(message)
    }
  }
  description (): string {
    return 'Возврат аргумента'
  }
  argumentParser (context: CommandContext): ArgumentParser {
    return new ArgumentParser(context.arguments, true, 'Аргумент', 'Аргументы')
  }
}

module.exports.run = async () => {
  Logger.info('Started Swinky Main plugin!')
  CommandDispatcher.get().add(new HelpCommand())
  CommandDispatcher.get().add(new AboutCommand())
  CommandDispatcher.get().add(new ArgumentEchoCommand())
}
