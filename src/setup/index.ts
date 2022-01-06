import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from 'dotenv';

dotenv.config();
const token = getEnvData('TOKEN');
const clientID = getEnvData('CLIENT_ID');
if (!token || !clientID) {
  throw new Error('環境変数の取得に失敗しました。');
}

function getEnvData(name: string): string {
  const envValue = process.env[name];
  if (!envValue) return '';
  return envValue;
}

function registerCommand(): object {
  return [
    {
      name: 'help',
      description: 'このBotの詳細情報を表示します。'
    }
  ];
}

const rest = new REST({ version: '9' }).setToken(token);

void (async () => {
  try {
    console.log('登録を開始します。');
    await rest.put(Routes.applicationCommands(clientID), {
      body: registerCommand()
    });
    console.log('登録に成功しました。');
  } catch (e) {
    console.error('登録に失敗しました。');
    console.error(e);
  }
});
