import { Message } from 'discord.js'
import { MessageContext } from 'vk-io'
import * as config from '../../config.json'
import { Logger } from './logger'

export abstract class SwinkyCommand {
  private _name: string

  constructor (name: string) {
    this._name = name
  }

  parse (
    message: string,
    sender: number | string,
    context?: Message | MessageContext<Record<string, any>>
  ): CommandContext {
    if (message.startsWith(config.command_prefix)) {
      const args = message.replace(config.command_prefix, '').split(' ')
      const command = args.shift()
      if (command.toLowerCase() == this._name.toLowerCase()) {
        return context
          ? new CommandContext(sender, this._name, args, context)
          : new CommandContext(sender, this._name, args)
      } else {
        return null
      }
    } else {
      return null
    }
  }

  abstract dispatch (context: CommandContext)
  abstract description (): string

  get name (): string {
    return this._name
  }
}

export class CommandContext {
  private _arguments: string[]
  private _name: string
  private _sender: number | string
  private _discordContext: Message
  private _vkContext: MessageContext<Record<string, any>>

  constructor (
    sender: number | string,
    name: string,
    args: string[],
    context?: Message | MessageContext<Record<string, any>>
  ) {
    this._arguments = args
    this._name = name
    this._sender = sender
    if (context) {
      if (context instanceof Message) {
        this._discordContext = context
      } else {
        this._vkContext = context
      }
    }
  }

  get arguments (): string[] {
    return this._arguments
  }

  get name (): string {
    return this._name
  }

  get sender (): number | string {
    return this._sender
  }

  get discordContext (): Message {
    return this._discordContext
  }

  get vkContext (): MessageContext<Record<string, any>> {
    return this._vkContext
  }
}

export class CommandDispatcher {
  static instance: CommandDispatcher = null

  private _commandMap = new Map<string, SwinkyCommand>()

  add (command: SwinkyCommand) {
    this._commandMap.set(command.name, command)
  }

  contains (name: string): boolean {
    return this._commandMap.has(name)
  }

  get (name: string): SwinkyCommand {
    return this._commandMap.get(name)
  }

  log () {
    Logger.log('DEBUG', this._commandMap.size)
  }

  get asMap () {
    return this._commandMap
  }

  static get (): CommandDispatcher {
    if (!this.instance) {
      this.instance = new CommandDispatcher()
      return this.instance
    } else {
      return this.instance
    }
  }
}
