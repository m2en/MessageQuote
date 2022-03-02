import { MessageActionRow, MessageSelectMenu } from 'discord.js';
export const DELETE_BUTTON_ID = 'quoteDelete';
export const DELETE_VALUE = 'delete_quote';

export const deleteButton = new MessageActionRow().setComponents([
  new MessageSelectMenu()
    .setCustomId(String(DELETE_BUTTON_ID))
    .setPlaceholder('引用に関する操作はこちら')
    .addOptions([
      {
        label: '引用を削除',
        description: '引用を削除します。',
        value: DELETE_VALUE
      }
    ])
]);
