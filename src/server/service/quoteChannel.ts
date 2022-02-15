import {
  AnyChannel,
  Client,
  Guild,
  Message,
  MessageEmbed,
  TextChannel
} from 'discord.js';
import { embedColor, toSec } from './quoteEvent';

async function getMessage(client: Client, receiptMsg: Message) {
  if (!receiptMsg.guild || receiptMsg.author.bot) return;

  const receiptLink = new RegExp(
    /https:\/\/(?:ptb\.|canary\.)?discord(?:app)?\.com\/channels\/(\d+)\/(\d+)/
  );
  const str = receiptMsg.content;
  const match = str.match(receiptLink);
  if (!match) return;
  const [, serverId, channelId] = match;
  const quoteChannel = await client.channels.fetch(channelId); // 引用チャンネル
  const quoteServer = await client.guilds.fetch(serverId); // 引用サーバー
  if (receiptMsg.content.startsWith(';')) {
    console.info(`Info: "` + receiptMsg.author.username + `" used quote skip.`);
    return;
  }
  return {
    serverId,
    quoteChannel,
    quoteServer
  };
}

function sanitize(
  serverId: string,
  quoteChannel: AnyChannel | null,
  quoteServer: Guild,
  receiptMsg: Message
): asserts quoteChannel is TextChannel {
  if (serverId !== receiptMsg.guild?.id) {
    throw new Error(
      `error: "` +
        receiptMsg.author.username +
        `" Cancel quoting a message from another server.`
    );
  }
  if (!quoteChannel || !quoteServer) {
    throw new Error(
      'Error: I was unable to discover the quoting channel and the quoting server.'
    );
  }
  if (!quoteChannel?.isText()) {
    throw new Error(
      'Error: The channel of the message for which the citation request was issued is not a text channel.'
    );
  }
}

function createInfoEmbed(quoteChannel: TextChannel) {
  const startTime = performance.now();
  console.info(
    `* Quote Create Start >>> Start creating citations. / (ChannelEmbed)`
  );

  const channelName = quoteChannel.name;
  const channelId = quoteChannel.id;
  const channelNfnw = quoteChannel.nsfw;
  const channelRatelimit = quoteChannel.rateLimitPerUser; // | null

  const sendChannelQuoteEmbed = new MessageEmbed()
    .setTitle(`チャンネル引用`)
    .setDescription(`${channelName} の情報を引用し、表示しています。`)
    .setColor(embedColor)
    .addField('チャンネル名', channelName, true)
    .addField('チャンネルID', channelId, true)
    .addField('メンション', `<#${channelId}>`, true)
    .addField('NSFWの有無(年齢制限)', channelNfnw ? 'はい' : 'なし', true);

  if (channelRatelimit) {
    sendChannelQuoteEmbed.addField(
      '低速モードあり',
      `${channelRatelimit}`,
      true
    );
  }

  if (channelNfnw) {
    sendChannelQuoteEmbed.addField(
      'NSFW有効: 注意',
      'NSFWチャンネルのため、このチャンネル内のメンションをMessageQuoteは引用せず無視します。'
    );
  }

  const endTime = performance.now();
  const createMs = Math.round(endTime - startTime) / toSec;
  console.info(
    `* Quote Create End >>> The creation of the citation has been completed successfully. - Done! ${createMs}`
  );

  return {
    sendChannelQuoteEmbed
  };
}

async function sendQuote(
  sendChannelQuoteEmbed: MessageEmbed,
  receiptMsg: Message
) {
  console.log(
    '* Quote Complete >>> "' + receiptMsg.author.username + '" uses a quote.'
  );
  await receiptMsg.reply({
    embeds: [sendChannelQuoteEmbed]
  });
}

async function quoteChannelSystem(
  receiptMsg: Message<boolean>,
  client: Client<boolean>
) {
  const message = await getMessage(client, receiptMsg);
  if (!message) return;
  const { serverId, quoteChannel, quoteServer } = message;

  sanitize(serverId, quoteChannel, quoteServer, receiptMsg);

  const quoteEmbed = createInfoEmbed(quoteChannel);
  if (!quoteEmbed) return;
  const sendEmbed = quoteEmbed.sendChannelQuoteEmbed;

  await sendQuote(sendEmbed, receiptMsg);
}

export function quoteChannel(client: Client) {
  client.on('messageCreate', async (receiptMsg) => {
    try {
      await quoteChannelSystem(receiptMsg, client);
    } catch (e) {
      console.error(e);
    }
  });
}
