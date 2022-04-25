import {
  Client,
  MessageActionRow,
  MessageButton,
  MessageEmbed
} from 'discord.js';
import * as dotenv from 'dotenv';
import { extractEnv } from '../util';

export const embedColor = '#6AC99D';

dotenv.config();
const { SKIP_PREFIX: prefix } = extractEnv(['SKIP_PREFIX']);

function createHelp() {
  const helpCommand =
    '```asciidoc\n' +
    '/help :: ヘルプを表示\n' +
    '/ping :: WebSocketとDiscord APIのレイテンシを表示\n' +
    '/debug [id] :: 指定したメッセージIDをデバック' +
    '```';
  const help = new MessageEmbed()
    .setTitle('MessageQuote Help:')
    .setDescription(
      'メッセージリンクからメッセージを取得して展開するDiscord Bot'
    )
    .setColor(embedColor)
    .addField(
      '基本的な使い方',
      `メッセージリンクをそのまま送信してください。引用をしてほしくない場合はメッセージの最初に\`${prefix}\`をつけてください。`
    )
    .addField(
      'コマンド一覧',
      '**◆ スラッシュコマンドが使える人のみに限られます ◆**\n' + helpCommand
    )
    .addField('Config', prefix);
  const linkButton1 = new MessageButton()
    .setStyle('LINK')
    .setLabel('GitHub')
    .setURL('https://github.com/approvers/MessageQuote');
  const linkButton2 = new MessageButton()
    .setStyle('LINK')
    .setLabel('Docs(ドキュメント)')
    .setURL('https://m2q.notion.site/11ce627092084d579f71c4a14cb927fb');

  return { help, linkButton1, linkButton2 };
}

export function helpCommand(client: Client) {
  client.on('interactionCreate', async (interaction) => {
    try {
      if (!interaction.isCommand() || !interaction.guild) return;
      if (interaction.commandName !== 'help') return;

      const { help, linkButton1, linkButton2 } = createHelp();

      await interaction.reply({
        embeds: [help],
        components: [
          new MessageActionRow().setComponents([linkButton1, linkButton2])
        ]
      });
    } catch (e) {
      console.error(e);
    }
  });
}
