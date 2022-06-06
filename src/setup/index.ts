import { REST } from '@discordjs/rest';
// this type is not exported from discord.js itself
import {
  RESTPostAPIApplicationCommandsJSONBody,
  Routes
} from 'discord-api-types/v9';
import * as dotenv from 'dotenv';

dotenv.config();
const TARGET_TOKEN = process.env.DISCORD_TOKEN;
const TARGET_CLIENT_ID = process.env.CLIENT_ID;
// この値が代入されていないのであればグローバルコマンドでの登録
const TARGET_GUILD_ID = process.env.TARGET_GUILD_ID;
if (!TARGET_TOKEN || !TARGET_CLIENT_ID) {
  throw new Error('環境変数に必要な値が設定されていません');
}

const rest = new REST({ version: '9' }).setToken(TARGET_TOKEN);

function commands(): RESTPostAPIApplicationCommandsJSONBody[] {
  return [
    {
      name: 'ping',
      description: 'pingを表示します',
      default_member_permissions: null
    },
    {
      name: 'debug',
      description:
        '指定メッセージをデバックします. (デバックしたいメッセージがあるチャンネルで実行してください。)',
      options: [
        {
          name: 'id',
          description:
            'デバックするメッセージのIDを入力(IDのコピーは開発者モードを有効にしてください)',
          type: 3,
          required: true
        }
      ],
      default_member_permissions: null
    }
  ];
}

void (async () => {
  try {
    console.log('Start: deploying application (/) commands.....');

    if (TARGET_GUILD_ID) {
      // ギルドコマンド
      await rest.put(
        Routes.applicationGuildCommands(TARGET_CLIENT_ID, TARGET_GUILD_ID),
        { body: [] }
      );
      await rest.put(
        Routes.applicationGuildCommands(TARGET_CLIENT_ID, TARGET_GUILD_ID),
        { body: commands() }
      );

      console.log('End: deploy application (/) commands in GuildCommand.');
    } else {
      // グローバルコマンド
      await rest.put(Routes.applicationCommands(TARGET_CLIENT_ID), {
        body: []
      });
      await rest.put(Routes.applicationCommands(TARGET_CLIENT_ID), {
        body: commands()
      });

      console.log('End: deploy application (/) commands in GlobalCommand.');
    }
  } catch (error) {
    console.error(JSON.stringify(error));
  }
})();
