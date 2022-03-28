import { Client, Interaction, MessageEmbed } from 'discord.js';
import { embedColor } from './helpCommand';

function createPing(client: Client, interaction: Interaction) {
  const pingReady = new MessageEmbed()
    .setTitle('MessageQuote Ping:')
    .setDescription('Pinging... Please wait...')
    .setColor('YELLOW');
  const pingEmbed = new MessageEmbed()
    .setTitle('MessageQuote Ping:')
    .setDescription('🏓 Pong!')
    .setColor(embedColor)
    .addField('Latency(WebSocket):', `${client.ws.ping}ms`, true)
    .addField(
      'Latency(API):',
      `${
        Date.now() - interaction.createdTimestamp
      }ms\n([Discord Status](https://discordstatus.com/))`,
      true
    )
    .setColor('YELLOW');

  return { pingReady, pingEmbed };
}

export function pingCommand(client: Client) {
  client.on('interactionCreate', async (interaction) => {
    try {
      if (!interaction.isCommand() || !interaction.guild) return;
      if (interaction.commandName !== 'ping') return;

      const { pingReady, pingEmbed } = createPing(client, interaction);

      await interaction.reply({ embeds: [pingReady] });
      await interaction.editReply({ embeds: [pingEmbed] });
    } catch (e) {
      console.error(e);
    }
  });
}
