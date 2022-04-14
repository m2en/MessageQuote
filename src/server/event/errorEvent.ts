import { Client } from 'discord.js';
import { getErrorEmbed } from '../util';

function getError(error: Error) {
  const name = error.name;
  const message = error.message;

  return { name, message };
}

export function errorEvent(client: Client) {
  client.on('error', (error) => {
    const { name, message } = getError(error);
    console.error('エラーが発生しました。 ：' + name);
    console.error(message);
    getErrorEmbed({ errorName: name, errorMessage: message });
  });
}
