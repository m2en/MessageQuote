import {
  CacheType,
  Client,
  Interaction,
  SelectMenuInteraction
} from 'discord.js';
import { DELETE_BUTTON_ID, DELETE_VALUE } from '../component/deleteButton';

async function deleteQuoteSystem(
  interaction: Interaction<CacheType> | SelectMenuInteraction<CacheType>
) {
  if (!interaction.guild || !interaction.isSelectMenu()) return;
  if (interaction.customId !== DELETE_BUTTON_ID) return;
  if (!interaction.values.find((name) => name.match(DELETE_VALUE))) return;
  const { channel } = interaction;
  const quote = await channel?.messages.fetch(interaction.message.id);
  if (!quote) return;

  await quote.delete();
  await interaction.reply({
    content: '引用を削除しました。',
    ephemeral: true
  });
  console.log(`${interaction.user.username} has removed the quote.`);
}

export function quoteDelete(client: Client<boolean>) {
  client.on('interactionCreate', async (interaction) => {
    try {
      await deleteQuoteSystem(interaction);
    } catch (e) {
      console.error(e);
    }
  });
}
