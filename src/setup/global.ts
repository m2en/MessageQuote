import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import * as dotenv from 'dotenv';
import { RESTPutAPIApplicationCommandsJSONBody } from 'discord-api-types/v9';

dotenv.config();
const token: string | undefined = process.env.DISCORD_TOKEN;
const clientId: string | undefined = process.env.CLIENT_ID;
const guildId: string | undefined = process.env.GUILD_ID;
if (!token || !clientId || !guildId) {
  console.error(
    '環境変数に必須のKeyが設定されていません。README.mdにあるKeyを設定してください。'
  );
  process.exit(1);
}

const rest = new REST({ version: '9' }).setToken(token);

function setCommand(): RESTPutAPIApplicationCommandsJSONBody {
  return [
    {
      name: '翻訳する',
      type: 3
    },
    {
      name: 'debug',
      description: 'メッセージをデバックします。',
      options: [
        {
          name: 'message',
          description: 'メッセージIDを指定します。',
          type: 3
        }
      ]
    },
    {
      name: 'tran',
      description: '文字列を翻訳します。',
      options: [
        {
          name: 'string',
          description: '翻訳したい文字列を指定してください。',
          type: 3,
          required: true
        },
        {
          name: 'language',
          description: '文字列 "String A" を翻訳する言語を指定してください。',
          type: 3,
          required: true,
          choices: [
            {
              name: '日本語',
              value: 'JA'
            },
            {
              name: '英語',
              value: 'EN-US'
            }
          ]
        }
      ]
    }
  ];
}

void (async () => {
  try {
    console.info('Application Commandの登録を開始します。');

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: []
    });
    await rest.put(Routes.applicationCommands(clientId), {
      body: setCommand()
    });

    console.info('Application Commandが正常に完了しました。');
  } catch (e) {
    console.error(JSON.stringify(e));
  }
});
