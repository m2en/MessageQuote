import { Client, Intents } from 'discord.js';
import * as dotenv from 'dotenv';
import { debugCommand, helpCommand, pingCommand } from './command';
import { errorEvent } from './event';
import { quote } from './service';
import { autoJoinThread } from './event/autoJoinThread';

// 環境変数の設定
dotenv.config();
function setupEnv<K extends readonly string[]>(
  ...keys: K
): Record<K[number], string> {
  for (const key of keys) {
    if (process.env[key] == undefined) {
      throw new Error(`Error: env(key) not found: ${key}`);
    }
  }

  return process.env as Record<K[number], string>;
}

const env = setupEnv('DISCORD_TOKEN');

// Discordクライアントのインスタンスを作成
const intents = new Intents();
intents.add(
  // ギルド関連のGateway Intents (1 << 0)
  Intents.FLAGS.GUILDS,
  // メッセージ関連のGateway Intents (1 << 9)
  Intents.FLAGS.GUILD_MESSAGES,
  // ギルドに送信され、なおかつリアクションが付与されたメッセージに対するGateway Intents (1 << 10)
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS
);

const client = new Client({ intents });

// ログイン時のイベント
client.login(env.DISCORD_TOKEN).catch(console.error);

client.once('ready', () => {
  console.log(`logging.....`);

  const clientUser = client.user;
  if (!clientUser) {
    throw new Error('Error: client.user is undefined');
  }

  setInterval(() => {
    clientUser.setActivity(`!help | ping:${client.ws.ping}ms`, {
      type: 'PLAYING'
    });
  }, 1000 * 60 * 30);

  console.log(`Done! - Connect to ${clientUser.username}(${clientUser.id})`);
});

// Event/Command の読み込み
helpCommand(client);
pingCommand(client);
debugCommand(client);

errorEvent(client);
autoJoinThread(client);

quote(client);
