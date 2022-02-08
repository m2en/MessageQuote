import { Client, Message } from 'discord.js';
import { MessageEventProvider } from '../runner';

export class MessageProxy implements MessageEventProvider<Message> {
  constructor(private readonly client: Client) {}

  onMessageCreate(handler: (message: Message) => Promise<void>): void {
    this.client.on('messageCreate', handler);
  }
}
