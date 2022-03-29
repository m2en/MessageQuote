import { Client } from 'discord.js';

function getError(error: Error) {
  const errorName = error.name;
  const errorMessage = error.message;

  return { errorName, errorMessage };
}

export function errorEvent(client: Client) {
  client.on('error', (error) => {
    const { errorName, errorMessage } = getError(error);
    console.error('エラーが発生しました。 ：' + errorName);
    console.error(errorMessage);
  });
}
