import {
  AnyChannel,
  Client,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  version
} from 'discord.js';
import dotenv from 'dotenv';
import { _help } from './command/help';
import { _quote } from './service/_quote';

dotenv.config();
const token = getEnv('DISCORD_TOKEN');
const status = getEnv('STATUS_CHANNEL_ID');
function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) return '';
  return value;
}

const client = new Client({
  intents: ['GUILDS', 'GUILD_MESSAGES']
});

/* 接続時にクライアントの情報を提供する */
function readyLog(client: Client): void {
  const connectionClient = client.user;
  const projectVersion = process.env.npm_package_version;
  if (connectionClient == null) return;
  console.info('============');
  console.info('');
  console.info('起動完了しました。');
  console.info('');
  console.info('接続クライアント> ' + connectionClient.username);
  console.info('接続クライアントID> ' + connectionClient.id);
  //
  console.info(`接続クライアントバージョン> ${String(projectVersion)}`);
  console.info('');
  console.info('discord.js バージョン> ' + version);
  console.info('');
  console.info('============');
}

void client.login(token);

_help(client);
_quote(client);

client.once('ready', async () => {
  readyLog(client);

  const channel: AnyChannel | null = await client.channels.fetch(`${status}`);
  if (!channel || !channel.isText()) return;

  try {
    await channel.send({
      content: '✅: <@586824421470109716>, 起動に成功しました。'
    });
  } catch (e) {
    console.error(e);
    client.destroy();
  }
});

client.on('error', async (e) => {
  const { name: errorName, message: errorMessage } = e;
  if (!errorName || !errorMessage) return;

  const channel: AnyChannel | null = await client.channels.fetch(status);
  if (!channel || !channel.isText()) return;

  const errorEmbed = new MessageEmbed()
    .setAuthor({ name: 'エラーが発生しました。' })
    .setTitle(errorName)
    .setDescription(errorMessage)
    .addField(
      '対処方法 / 導入Version',
      '・<@586824421470109716> がいる場合はこのEmbedにある情報を提供してください。\n・居ない場合はTwitterかGitHubのIssueから報告してください。'
    )
    .addField(
      '対処方法 / ご自身でホストしている場合',
      'GitHubのIssueから報告してください。GitHubが使用できない場合はTwitter等で報告してください。\n自分で修正も可能ですが、おすすめしません。'
    );
  const twitterButton = new MessageButton()
    .setLabel('Twitter')
    .setStyle('LINK')
    .setURL('https://twitter.com/2I92me_1');
  const githubButton = new MessageButton()
    .setLabel('GitHub / New issue')
    .setStyle('LINK')
    .setURL('https://github.com/approvers/MessageQuote/issues/new');
  const discordjsButton = new MessageButton()
    .setLabel('discord.js / errors')
    .setStyle('LINK')
    .setURL('https://discordjs.guide/popular-topics/errors.html');

  await channel.send({
    embeds: [errorEmbed],
    components: [
      new MessageActionRow().addComponents([
        twitterButton,
        githubButton,
        discordjsButton
      ])
    ]
  });
});
