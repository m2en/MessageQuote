import { Client } from 'discord.js';

export function quoteDelete(client: Client<boolean>) {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.guild || !interaction.isButton()) return;
    if (interaction.customId !== 'quoteDelete') return;

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
