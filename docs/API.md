# API

## Команды

Чтобы добавить команду, нужно создать класс и наследовать SwinkyCommand, реализовать методы и в run() плагина добавить команду в CommandDispatcher.

Пример:

```javascript
class HelpCommand extends SwinkyCommand {
  constructor () {
    super('help')
  }

  dispatch (context: CommandContext) {
    var builder = '\n'
    CommandDispatcher.get().asMap.forEach((command, name) => {
      builder += `/${name} - ${command.description()}\n`
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

module.exports.run = async () => {
  Logger.info('Started Swinky Main plugin!')
  CommandDispatcher.get().add(new HelpCommand())
  CommandDispatcher.get().add(new AboutCommand())
}
```

Чтобы получить клиенты ботов используйте:

```javascript
getDiscordClient() // import { getDiscordClient } from '@swinky/api-discord/plugin'
getVKClient() // import { getVKClient } from '@swinky/api-vk/plugin'
```
