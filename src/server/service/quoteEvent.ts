import { Client, Message, MessageEmbed } from 'discord.js';

async function extracted(
  receiptMsg: Message<boolean>,
  client: Client<boolean>
) {
  // BOTとDMからのメッセージは弾く
  if (receiptMsg.author.bot || !receiptMsg.guild) return;

  // 1. メッセージの受け取り
  // https://(ptb.|canary.)?discord.com/channels/サーバーID/チャンネルID/メッセージID
  const receiptLink = new RegExp(
    /https:\/\/(?:ptb.|canary.)?discord(?:app)?.com\/channels\/(\d+)\/(\d+)\/(\d+)/
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

  // 2. 例外処理
  const failedMsg =
    'Unexpected error reported from "quoteEvent" module. <@586824421470109716>, check the log. Or report it to <@586824421470109716>.';

  if (serverId !== receiptMsg.guild.id) {
    throw new Error(
      `error: "` +
        receiptMsg.author.username +
        `" Cancel quoting a message from another server.`
    );
  }
  if (!quoteChannel || !quoteServer) {
    await receiptMsg.reply(failedMsg);
    throw new Error(
      'Error: I was unable to discover the quoting channel and the quoting server.'
    );
  }

  if (!quoteChannel?.isText()) return;

  // 3. メッセージの取得
  const quoteMessage = await quoteChannel.messages.fetch(messageId);

  if (!quoteMessage) return;
  if (quoteMessage.system) return;

  // 4. 引用の作成
  const startTime = performance.now();
  console.info(`* Quote Create Start >>> Start creating citations.`);

  const quoteUser = quoteMessage.author;
  const quoteChannelId = quoteMessage.channel.id;
  const quoteUserAvatar = quoteUser.avatarURL();

  if (!quoteUser) {
    await receiptMsg.reply(failedMsg);
    throw new Error(
      'The user information of the quoted message could not be retrieved from the Discord API.'
    );
  } else if (!quoteChannelId) {
    await receiptMsg.reply(failedMsg);
    throw new Error(
      'Error: The channel ID of the quoted message could not be retrieved from the Discord API.'
    );
  }

  const quoteCreateTstamp = quoteMessage.createdTimestamp / 1000;

  const sendQuoteEmbed = new MessageEmbed()
    .setDescription(quoteMessage.content)
    .setColor('#FFC9E9')
    .setAuthor({ name: quoteUser.username + `(${quoteUser.id})` })
    .addField('チャンネル', '<#' + quoteChannelId + '>', true)
    .addField(
      '送信日時',
      `<t:${Math.floor(quoteCreateTstamp)}:F>(<t:${Math.floor(
        quoteCreateTstamp
      )}:R>)`,
      true
    );

  if (quoteUserAvatar) {
    sendQuoteEmbed.setAuthor({
      name: quoteUser.username + `(${quoteUser.id})`,
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
  const createMs = Math.round(endTime - startTime) / 20;
  console.info(
    `* Quote Create End >>> The creation of the citation has been completed successfully. - Done! ${createMs}`
  );

  // 5. 送信
  sendQuoteEmbed.addField('処理時間', String(createMs));

  console.log(
    '* Quote Complete >>> "' + receiptMsg.author.username + '" uses a quote.'
  );
  await receiptMsg.reply({ embeds: [sendQuoteEmbed] });
}

/**
 * 引用機能を司るモジュール
 * @param client
 */
export function quoteEvent(client: Client) {
  client.on('messageCreate', async (receiptMsg) => {
    try {
      await extracted(receiptMsg, client);
    } catch (e) {
      console.error(e);
    }
  });
}
