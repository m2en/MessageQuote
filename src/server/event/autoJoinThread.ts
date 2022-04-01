import { Client, MessageEmbed, ThreadChannel } from 'discord.js';

async function joinThread(thread: ThreadChannel) {
  await thread.join();
}

function createEmbed(thread: ThreadChannel) {
  return new MessageEmbed()
    .setTitle('MessageQuote AutoThreadJoin')
    .setDescription(`**${thread.name}** has been joined.`)
    .addField('メンション', `<#${thread.id}>`, true)
    .addField('ID', thread.id, true)
    .addField(
      'ヒント',
      'スレッドの管理の権限をもっているユーザーはスレッドからMessageQuoteを削除できます。'
    );
}

async function sendJoinMessage(thread: ThreadChannel) {
  const embed = createEmbed(thread);
  await thread.send({ embeds: [embed] });
}

export function autoJoinThread(client: Client) {
  client.on('threadCreate', async (thread) => {
    await joinThread(thread);
    await sendJoinMessage(thread);
  });
}
