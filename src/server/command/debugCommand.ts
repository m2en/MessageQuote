import {
  Client,
  Interaction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed
} from 'discord.js';
import { embedColor } from './helpCommand';

async function getMessage(messageId: string, interaction: Interaction) {
  const channelId = interaction.channelId;
  const guild = interaction.guild;
  if (!channelId || !guild) return;

  const channel = await guild.channels.fetch(channelId);
  if (!channel) throw new Error('Channel not found');
  if (!channel.isText()) throw new Error('Channel is not a text channel');

  const message = await channel.messages.fetch(messageId);
  if (!message) throw new Error('Message not found');
  if (message.system) throw new Error('Message a system message');

  return message;
}

function createDebug(message: Message) {
  let content = message.content;
  let debugContext = '```\n' + content + '\n```';
  const debug = new MessageEmbed()
    .setTitle('MessageQuote Debug')
    .setDescription(debugContext)
    .setColor(embedColor);
  const debugMessage = new MessageButton()
    .setStyle('LINK')
    .setLabel('元のメッセージ')
    .setURL(message.url);

  if (content.match('`')) {
    content = content.replaceAll('`', `'`);
    debugContext = '```\n' + content + '\n```';
    debug.setDescription(debugContext);
    debug.setColor('YELLOW');
    debug.addField(
      '警告',
      'デバック対象メッセージにグレイヴ・アクセント(`)が含まれていたため、シングルクォーテーションに自動変換しました。'
    );
  }

  return {
    debug,
    debugMessage
  };
}

export function debugCommand(client: Client) {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand() || !interaction.guild) return;
    if (interaction.commandName !== 'debug') return;
    const messageId = interaction.options.getString('id');
    if (!messageId) return;

    const message = await getMessage(messageId, interaction);
    if (!message) return;
    const { debug, debugMessage } = createDebug(message);

    await interaction.reply({
      embeds: [debug],
      components: [new MessageActionRow().addComponents([debugMessage])]
    });
  });
}
