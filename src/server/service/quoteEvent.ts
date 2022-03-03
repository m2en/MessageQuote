import {
  AnyChannel,
  Client,
  Guild,
  Message,
  MessageEmbed,
  TextChannel
} from 'discord.js';
import { deleteButton } from '../component/deleteButton';

const toSec = 1000;

async function getMessage(client: Client, receiptMsg: Message) {
  // メッセージの受け取り
  // BOTとDMからのメッセージは弾く
  if (receiptMsg.author.bot || !receiptMsg.guild) return;

  // https://(ptb.|canary.)?discord.com/channels/サーバーID/チャンネルID/メッセージID
  const receiptLink = new RegExp(
    /https:\/\/(?:ptb.|canary.)?discord(?:app)?\.com\/channels\/(\d+)\/(\d+)\/(\d+)/
  );
  const str = receiptMsg.content;
  const match = str.match(receiptLink);
  if (!match) return;
  const [, serverId, channelId, messageId] = match;
  const quoteChannel = await client.channels.fetch(`${channelId}`); // 引用元チャンネル
  const quoteServer = await client.guilds.fetch(`${serverId}`); // 引用元サーバー
  if (receiptMsg.content.startsWith(';')) {
    console.info(`Info: "` + receiptMsg.author.username + `" used quote skip.`);
    return;
  }
  return {
    serverId,
    messageId,
    quoteChannel,
    quoteServer
  };
}

function sanitize(
  serverId: string,
  receiptMsg: Message,
  quoteChannel: AnyChannel | null,
  quoteServer: Guild
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

async function getQuote(
  quoteChannel: TextChannel,
  messageId: string,
  receiptMsg: Message
) {
  const quoteMessage = await quoteChannel.messages.fetch(messageId);

  if (quoteChannel.nsfw) {
    const errorReply = await receiptMsg.reply({
      embeds: [
        new MessageEmbed()
          .setTitle('NSFWチャンネルのため引用をキャンセルしました。')
          .setDescription(
            'メッセージの内容は直接メッセージにジャンプしてください。'
          )
          .setColor('RED')
      ]
    });
    setTimeout(() => {
      void errorReply.delete();
      console.error(
        `Error: ${receiptMsg.author.username} tried to quote a message on the NSFW channel, but skipped it.`
      );
    }, toSec * 6);
    return;
  }
  if (!quoteMessage) return;
  if (quoteMessage.system) return;

  return quoteMessage;
}

function createQuoteEmbed(quoteMessage: Message) {
  const startTime = performance.now();
  console.info(`* Quote Create Start >>> Start creating citations.`);

  const quoteUser = quoteMessage.author;
  const quoteChannelId = quoteMessage.channel.id;
  const quoteUserAvatar = quoteUser.avatarURL();

  let quoteMessageType: string;
  // システムメッセージ等、MessageQuoteが引用できないものは除外
  // 参考: https://discord.js.org/#/docs/discord.js/stable/typedef/MessageType
  switch (quoteMessage.type) {
    case 'DEFAULT': {
      quoteMessageType = 'デフォルトメッセージ';
      break;
    }
    case 'REPLY': {
      quoteMessageType = 'リプライメッセージ';
      break;
    }
    case 'APPLICATION_COMMAND': {
      quoteMessageType = 'アプリケーション';
      break;
    }
  }

  if (!quoteUser) {
    throw new Error(
      'The user information of the quoted message could not be retrieved from the Discord API.'
    );
  }

  if (!quoteChannelId) {
    throw new Error(
      'Error: The channel ID of the quoted message could not be retrieved from the Discord API.'
    );
  }

  const quoteCreateTstamp = quoteMessage.createdTimestamp / toSec;

  const sendQuoteEmbed = new MessageEmbed()
    .setDescription(quoteMessage.content)
    .setColor('#FFC9E9')
    .setAuthor({ name: `${quoteUser.username}` })
    .setFooter({ text: 'メッセージタイプ: ' + quoteMessageType })
    .addField('チャンネル', `<#${quoteChannelId}>`, true)
    .addField(
      '送信日時',
      `<t:${Math.floor(quoteCreateTstamp)}:F>(<t:${Math.floor(
        quoteCreateTstamp
      )}:R>)`,
      true
    );

  if (quoteUserAvatar) {
    sendQuoteEmbed.setAuthor({
      name: quoteUser.username,
      iconURL: quoteUserAvatar
    });
  }

  if (quoteMessage.attachments.size) {
    const [file] = quoteMessage.attachments.map((attachment) => attachment.url);
    sendQuoteEmbed.setImage(file).addField('添付ファイル', `[あり](${file})`);
  }

  if (quoteMessage.stickers.size) {
    const [stickerFile] = quoteMessage.stickers.map((sticker) => sticker.url);
    sendQuoteEmbed
      .setImage(stickerFile)
      .addField('ステッカー', `[あり](${stickerFile})`);
  }

  const endTime = performance.now();
  const createMs = Math.round(endTime - startTime) / toSec;
  console.info(
    `* Quote Create End >>> The creation of the citation has been completed successfully. - Done! ${createMs}`
  );

  return {
    sendQuoteEmbed,
    createMs
  };
}

async function sendQuote(
  sendQuoteEmbed: MessageEmbed,
  createMs: number,
  receiptMsg: Message
) {
  sendQuoteEmbed.addField('処理時間', String(createMs));

  console.log(
    '* Quote Complete >>> "' + receiptMsg.author.username + '" uses a quote.'
  );
  await receiptMsg.reply({
    embeds: [sendQuoteEmbed],
    components: [deleteButton]
  });
}

async function quoteSystem(
  receiptMsg: Message<boolean>,
  client: Client<boolean>
) {
  const message = await getMessage(client, receiptMsg);
  if (!message) return;
  const { serverId, messageId, quoteChannel, quoteServer } = message;

  sanitize(serverId, receiptMsg, quoteChannel, quoteServer);

  const quote = await getQuote(quoteChannel, messageId, receiptMsg);
  if (!quote) return;

  const quoteEmbed = createQuoteEmbed(quote);
  if (!quoteEmbed) return;
  const { sendQuoteEmbed, createMs } = quoteEmbed;

  await sendQuote(sendQuoteEmbed, createMs, receiptMsg);
}

/**
 * 引用機能を司るモジュール
 * @param client
 */
export function quoteEvent(client: Client) {
  client.on('messageCreate', async (receiptMsg) => {
    try {
      await quoteSystem(receiptMsg, client);
    } catch (e) {
      console.error(e);
    }
  });
}
