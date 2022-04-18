import { Message, MessageEmbed } from 'discord.js';

export const toSec = 1000;

export type quoteProps = {
  message: Message;
};

/**
 * 参考元: watano1168/limitimes
 * https://github.com/watano1168/limitimes/blob/8364c23332bcc0a2c0cb0cb897a374d9b389fc89/src/controllers/send-quote.ts
 *
 * このような方法を知れてよかった、ありがとうございます。
 * @param message
 */
export function getQuoteEmbed({ message }: quoteProps): MessageEmbed {
  const avatarURL = message.author.avatarURL();
  const createAt = message.createdTimestamp / toSec;

  const embed = new MessageEmbed()
    .setDescription(message.content)
    .setAuthor({
      name: message.author.username,
      iconURL: avatarURL ?? undefined
    })
    .setColor('AQUA')
    .addField('チャンネル', `<#${message.channelId}>`, true)
    .addField('送信日時', `<t:${Math.floor(createAt)}:R>`, true);

  // 添付ファイル
  message.attachments
    .map((attachment) => attachment.url)
    .forEach((url) => embed.setImage(url));
  message.attachments
    .map((attachment) => attachment.name)
    .forEach((name) =>
      embed.addField('添付ファイル', `${name ?? '不明'}`, true)
    );

  // ステッカー(スタンプ)
  message.stickers
    .map((sticker) => sticker.url)
    .forEach((url) => embed.setThumbnail(url));
  message.stickers
    .map((sticker) => sticker.name)
    .forEach((name) => embed.addField('スタンプ', `${name ?? '不明'}`), true);

  return embed;
}
