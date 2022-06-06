import { MessageEmbed, ThreadChannel } from 'discord.js';

async function joinThread(thread: ThreadChannel) {
  await thread.join();
}

function createEmbed(thread: ThreadChannel) {
  return new MessageEmbed()
    .setTitle('MessageQuote AutoThreadJoin')
    .setDescription(`**${thread.name}** has been joined.`)
    .setColor('AQUA')
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

export async function autoJoinThread(thread: ThreadChannel) {
  await joinThread(thread);
  await sendJoinMessage(thread);
}
