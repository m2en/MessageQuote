import { Client, Message, MessageEmbed } from 'discord.js';
import { prefix } from '../util';

function createPing(client: Client, message: Message) {
  const pingEmbed = new MessageEmbed()
    .setTitle('MessageQuote Ping:')
    .setDescription('🏓 Pong!')
    .setColor('YELLOW')
    .addField('Latency(WebSocket):', `${client.ws.ping}ms`, true)
    .addField(
      'Latency(API):',
      `${
        Date.now() - message.createdTimestamp
      }ms\n([Discord Status](https://discordstatus.com/))`,
      true
    )
    .setColor('YELLOW');

  return { pingEmbed };
}

export async function ping(client: Client, message: Message) {
  try {
    if (message.content !== prefix + 'ping') return;

    const { pingEmbed } = createPing(client, message);

    await message.reply({ embeds: [pingEmbed] });
  } catch (e) {
    console.error(e);
  }
}
