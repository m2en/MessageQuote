import { AnyChannel, Client, Message } from 'discord.js';

async function getCommand(
  client: Client,
  message: Message,
  prefix: string,
  command: string
) {
  if (message.author.bot || !message.guild) return;

  const str = message.content;
  const match = str.startsWith(command);
  if (!match) return;

  const commandArgs = str.slice(prefix.length).trim().split(' ');
  const argsMessageId = commandArgs[1];
  if (!argsMessageId) {
    await message.reply({
      content: `**メッセージIDが指定されていません。**\n Usage: \`${command} <メッセージID>\``
    });
    return;
  }

  const channel = await client.channels.fetch(message.channel.id);
  if (!channel) {
    throw new Error('Could not obtain guild ID and channel ID.');
  }

  return {
    argsMessageId,
    channel
  };
}

async function getMessage(
  argsMessageId: string,
  channel: AnyChannel,
  message: Message
) {
  if (!channel.isText()) return;

  const debugMessage = await channel.messages.fetch(argsMessageId);
  if (!debugMessage) {
    await message.reply({
      content: '**指定のメッセージを見つけることができませんでした。'
    });
    return;
  }

  return {
    debugMessage
  };
}

async function runDebug(debugMessage: Message, message: Message) {
  console.info(`* Debug Start`);

  const debugContent = debugMessage.content;

  if (debugContent.match('`')) {
    const replaceContent = debugContent.replaceAll('`', "'");
    const debugResult = '```\n' + replaceContent + '\n```';

    await message.reply({
      content:
        "デバックに成功しました。\n**警告:** デバックターゲットメッセージにグレイヴ・アクセント(`)が含まれていたため、シングルクォーテーション(')に変換しました。\n" +
        debugResult
    });
    console.info(
      `* Debug End (Grave accent conversion was performed!) : ` +
        debugMessage.author.username
    );
    return;
  }

  const debugResult = '```\n' + debugContent + '\n```';
  await message.reply({
    content: 'デバックに成功しました。\n' + debugResult
  });

  console.info(`* Debug End: ` + debugMessage.author.username);
}

async function debugSystem(
  client: Client,
  message: Message,
  prefix: string,
  command: string
) {
  const commandData = await getCommand(client, message, prefix, command);
  if (!commandData) return;
  const { argsMessageId, channel } = commandData;

  const messageData = await getMessage(argsMessageId, channel, message);
  if (!messageData) return;

  await runDebug(messageData.debugMessage, message);
}

export function debugCommand(client: Client, prefix: string) {
  const command = `${prefix}debug`;
  client.on('messageCreate', async (message) => {
    try {
      await debugSystem(client, message, prefix, command);
    } catch (e) {
      console.error(e);
    }
  });
}
