import { Client, Message, MessageEmbed, Snowflake } from 'discord.js';
import { getQuoteEmbed, getErrorEmbed } from '../util';

function getLink(message: Message) {
  if (message.author.bot || !message.guild) return;
  if (message.content.startsWith(';')) return;

  const messageLink =
    /https:\/\/(?:ptb\.|canary\.)?discord(?:app)?\.com\/channels\/(\d+)\/(\d+)\/(\d+)/;
  const str = message.content;
  const match = str.match(messageLink);
  if (!match) return;
  const authorId = message.author.id;
  const [, serverId, channelId, messageId] = match;

  if (serverId !== message.guildId) return;

  return {
    authorId,
    serverId,
    channelId,
    messageId
  };
}

async function fetchMessage(
  client: Client,
  authorId: Snowflake,
  serverId: Snowflake,
  channelId: Snowflake,
  messageId: Snowflake
) {
  const guild = await client.guilds.fetch(serverId);
  if (!guild) throw Error('ギルドが存在しません。');
  const member = await guild.members.fetch(authorId);
  if (!member) throw Error('メンバーが存在しません。');

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
      const { serverId, authorId, channelId, messageId } = id;

      const message = await fetchMessage(
        client,
        authorId,
        serverId,
        channelId,
        messageId
      );
      if (!message) return;

      const embed = createEmbed(message);
      await sendQuote(embed, request);
    } catch (error) {
      console.error(error);
    }
  });
}
