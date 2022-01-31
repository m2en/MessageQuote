import * as dotenv from 'dotenv';
import { Client, ClientUser } from 'discord.js';

dotenv.config();
const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error(
    '環境変数に必須のKeyが設定されていません。README.mdにあるKeyを設定してください。'
  );
  process.exit(1);
}

const client = new Client({
  intents: ['GUILDS', 'GUILD_MESSAGES']
});

void client.login(token);

client.on('ready', () => {
  const shardClient: ClientUser | null = client.user;
  const shardClientV: string = process.env.npm_package_version ?? '不明';
  if (!shardClient) return;

  console.log(`${shardClient?.username}@${shardClientV} 起動しています......`);

  // アクティビティ登録

  setInterval(function () {
    shardClient.setActivity(
      `v${shardClientV} ｜ /help ｜ Ping: ${client.ws.ping}ms`
    );
  }, 1000 * 15);
});
