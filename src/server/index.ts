import * as dotenv from 'dotenv';
import { Client, ClientUser } from 'discord.js';
import { quoteDelete, quoteEvent } from './service';
import { debugCommand } from './command/debugCommand';

dotenv.config();
const token = process.env.DISCORD_TOKEN;
const prefix = process.env.PREFIX || '!';
if (!token) {
  throw new Error(
    'The required key is not set in the environment variable, please set the key in README.md.'
  );
}

const client = new Client({
  intents: ['GUILDS', 'GUILD_MESSAGES']
});

void client.login(token);

quoteEvent(client);
quoteDelete(client);
// ----
debugCommand(client, prefix);

client.on('ready', () => {
  const shardClient: ClientUser | null = client.user;
  const shardClientV: string = process.env.npm_package_version ?? 'unknown';
  if (!shardClient) return;

  console.log(`${shardClient.username}@${shardClientV} Start.....`);

  console.log('= 環境変数設定 =');
  console.log('Prefix: ' + prefix);

  // アクティビティ登録

  setInterval(function () {
    shardClient.setActivity(`v${shardClientV} ｜  Ping: ${client.ws.ping}ms`);
  }, 1000 * 15);
  console.log('Successfully configured activity.');

  console.log(`${shardClient.username}@${shardClientV} Operation start.`);
});
