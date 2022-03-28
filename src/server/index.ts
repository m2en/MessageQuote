import { Client, Intents } from 'discord.js';
import * as dotenv from 'dotenv';
import { debugCommand, helpCommand, pingCommand } from './command';

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

const env = setupEnv('DISCORD_TOKEN', 'npm_package_version');

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
  const startMS = performance.now();
  console.log(`logging.....`);

  const clientUser = client.user;
  const packageVersion = env.npm_package_version ?? 'unknown';
  if (!clientUser) {
    throw new Error('Error: client.user is undefined');
  }

  setInterval(() => {
    clientUser.setActivity(
      `!help | v${packageVersion} | ping:${client.ws.ping}ms`,
      { type: 'PLAYING' }
    );
  }, 1000 * 60 * 30);

  const endMS = Math.round(performance.now() - startMS);
  console.log(
    `Done! (${endMS}ms) - Connect to ${clientUser.username}(${clientUser.id})`
  );
});

// Event/Command の読み込み
helpCommand(client);
pingCommand(client);
debugCommand(client);
