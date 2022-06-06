import { MessageEmbed } from 'discord.js';

export type errorProps = {
  errorName: string;
  errorMessage: string;
};

export function getErrorEmbed({
  errorName,
  errorMessage
}: errorProps): MessageEmbed {
  return new MessageEmbed()
    .setTitle('予期せぬエラーが発生しました。')
    .setDescription(errorMessage)
    .addField('エラー名', errorName)
    .addField(
      '開発者に報告する',
      '[Github - Issue](https://github.com/approvers/MessageQuote/issues/new)'
    );
}
