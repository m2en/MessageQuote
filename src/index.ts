import { Client, ClientUser, Intents, version } from 'discord.js';
import { ping, quote, autoJoinThread } from './service';
import { prefix, token } from './util';

// Discordクライアントのインスタンスを作成
const intents = new Intents();
intents.add(
  // ギルド関連のGateway Intents (1 << 0)
  Intents.FLAGS.GUILDS,
  // メッセージ関連のGateway Intents (1 << 9)
  Intents.FLAGS.GUILD_MESSAGES
);

const client = new Client({ intents });

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment
const clientVersion: string = require('../package.json').version;

// ログイン時のイベント
function createLoginLog(user: ClientUser) {
  const loginLog =
    '=========\n' +
    '接続が完了し、MessageQuoteが利用可能になりました。\n\n' +
    `接続元ユーザー: ${user.username}\n` +
    `接続元ユーザーID: ${user.id}\n` +
    `MessageQuoteのバージョン: v${clientVersion} (https://github.com/m2en/MessageQuote/releases/latest)\n` +
    `discord.jsのバージョン: v${version} (https://github.com/discordjs/discord.js/releases/latest)\n\n` +
    `SkipPrefix: ${prefix}\n` +
    '=========\n';
  return console.log(loginLog);
}

client.login(token).catch(console.error);

client.once('ready', () => {
  console.log(`ログインしています....`);

  const clientUser = client.user;
  if (!clientUser) {
    throw new Error(
      'Error: 接続すべきクライアントユーザー(Bot)を取得することができませんでした。'
    );
  }

  setInterval(() => {
    clientUser.setActivity(`v${clientVersion} | ping:${client.ws.ping}ms`, {
      type: 'PLAYING'
    });
  }, 1000 * 30);

  createLoginLog(clientUser);
});

client.on('messageCreate', async (message) => {
  if (!message.guild || message.author.bot) return;
  await quote(client, message);
  await ping(client, message);
});

client.on('threadCreate', async (thread) => {
  await autoJoinThread(thread);
});
