# API

## Команды

Чтобы добавить команду, нужно создать класс и наследовать SwinkyCommand, реализовать методы и в run() плагина добавить команду в CommandDispatcher.

Пример:

```javascript
import {
  ArgumentParser,
  CommandContext,
  CommandDispatcher,
  SwinkyCommand
} from '@swinky/core/command'
import { Logger } from '@swinky/core/logger'

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
        builder += `/${name}`
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
```

### Аргументы

Был добавлен парсер аргументов. Чтобы им пользоваться нужно реализовать фукнции argumentParser и argumentParserWithoutContext по образцу выше.

## Боты

Чтобы получить клиенты ботов используйте:

```javascript
getDiscordClient() // import { getDiscordClient } from '@swinky/api-discord/plugin'
getVKClient() // import { getVKClient } from '@swinky/api-vk/plugin'
```

## Плагины

Чтобы сделать свой плагин, создайте папку в packages и введите там yarn init, затем установите туда нужные пакеты (если нужно).

И создайте там файл plugin.ts со следующим содержимым:

```javascript
module.exports.run = async () => {
  // Код при запуске плагина
}
```
