import { Client, Message, MessageEmbed } from 'discord.js';
import { getQuoteEmbed, getErrorEmbed } from '../util';

function getLink(message: Message) {
  if (message.author.bot || !message.guild) return;
  if (message.content.startsWith(';')) return;

  const messageLink = new RegExp(
    /https:\/\/(?:ptb.|canary.)?discord(?:app)?\.com\/channels\/(\d+)\/(\d+)\/(\d+)/
  );
  const str = message.content;
  const match = str.match(messageLink);
  if (!match) return;
  const [, serverId, channelId, messageId] = match;

  if (serverId !== message.guildId) return;

  return {
    channelId,
    messageId
  };
}

async function fetchMessage(
  client: Client,
  channelId: string,
  messageId: string
) {
  const channel = await client.channels.fetch(channelId);
  if (!channel || !channel.isText())
    throw Error(
      'チャンネルが存在しないまたは、テキストチャンネルではありません。'
    );
  const message = await channel.messages.fetch(messageId);
  if (!message || message.system)
    throw Error('メッセージが存在しないまたは、システムメッセージです。');
  return message;
}

function createEmbed(message: Message) {
  try {
    return getQuoteEmbed({ message: message });
  } catch (error) {
    if (error instanceof Error) {
      return getErrorEmbed({
        errorName: error.name,
        errorMessage: error.message
      });
    }

    throw error;
  }
}

async function sendQuote(createEmbed: MessageEmbed, message: Message) {
  await message.reply({ embeds: [createEmbed] });
}

export function quote(client: Client) {
  client.on('messageCreate', async (request) => {
    try {
      const id = getLink(request);
      if (!id) return;
      const { channelId, messageId } = id;

      const message = await fetchMessage(client, channelId, messageId);
      if (!message) return;

      const embed = createEmbed(message);
      await sendQuote(embed, request);
    } catch (error) {
      console.error(error);
    }
  });
}
