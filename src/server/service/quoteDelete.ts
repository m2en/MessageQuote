import { Client } from 'discord.js';
export const DELETE_BUTTON_ID = 'quoteDelete';

export function quoteDelete(client: Client<boolean>) {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.guild || !interaction.isButton()) return;
    if (interaction.customId !== DELETE_BUTTON_ID) return;

    const channel = interaction.channel;
    const quote = await channel?.messages.fetch(interaction.message.id);
    if (!quote) return;

    await quote.delete();
    await interaction.reply({
      content: 'あなたの引用を削除しました。',
      ephemeral: true
    });
  });
}
