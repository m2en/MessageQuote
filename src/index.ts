import { AnyChannel, Client, version } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();
const token = getEnv('DISCORD_TOKEN');
const status = getEnv('STATUS_CHANNEL_ID');
function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) return '';
  return value;
}

const client = new Client({
  intents: [0]
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

client.login(token).catch(console.error);

client.once('ready', async () => {
  readyLog(client);

  const channel: AnyChannel | null = await client.channels.fetch(`${status}`);
  if (!channel || !channel.isText()) return;

  try {
    void channel.send({
      content: '✅: <@586824421470109716>, 起動に成功しました。'
    });
  } catch (e) {
    console.error(e);
    client.destroy();
  }
});
