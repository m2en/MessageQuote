import {
  Client,
  Message,
  MessageEmbed,
  Permissions,
  Snowflake
} from 'discord.js';
import { getQuoteEmbed, getErrorEmbed } from '../util';
import * as dotenv from 'dotenv';

dotenv.config();
function setupEnv<K extends readonly string[]>(
  ...keys: K
): Record<K[number], string> {
  for (const key of keys) {
    if (process.env[key] == undefined) {
      throw new Error(
        `Error: 次の環境変数を取得することができませんでした: ${key} \n 環境変数の詳細は README を確認してください。`
      );
    }
  }

  return process.env as Record<K[number], string>;
}

const env = setupEnv('SKIP_PREFIX');

function getLink(message: Message) {
  if (message.author.bot || !message.guild) return;
  if (message.content.startsWith(env.SKIP_PREFIX)) return;

  const messageLink =
    /https:\/\/(?:ptb\.|canary\.)?discord(?:app)?\.com\/channels\/(\d+)\/(\d+)\/(\d+)/;
  const str = message.content;
  const match = str.match(messageLink);
  if (!match) return;
  const authorId = message.author.id;
  const [, serverId, channelId, messageId] = match;

  if (serverId !== message.guildId)
    throw Error(
      '引用リクエスト元のサーバーIDと一致しないため、引用リクエストを無視しました。'
    );

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
  if (!guild)
    throw Error('ギルドが存在しないか、Discord APIからのfetchに失敗しました。');
  const member = await guild.members.fetch(authorId);
  if (!member)
    throw Error(
      'メンバーが存在しません。Discord API (in Guild) からのfetchに失敗しました。'
    );

  const channel = await guild.channels.fetch(channelId);
  if (!channel || !channel.isText())
    throw Error(
      'チャンネルが存在しないまたは、テキストチャンネル・スレッドチャンネル・アナウンスチャンネルではありません。'
    );
  if (!member.permissionsIn(channel).has(Permissions.FLAGS.VIEW_CHANNEL))
    throw Error(
      'チャンネルにアクセスできないユーザーからの引用リクエストを無視しました。'
    );

  const message = await channel.messages.fetch(messageId);
  if (!message || message.system)
    throw Error('メッセージが存在しないまたは、システムメッセージです。');
  if ([...message.content].length >= 4096)
    throw Error('メッセージの内容が上限に達しているため、引用に失敗しました。');
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
