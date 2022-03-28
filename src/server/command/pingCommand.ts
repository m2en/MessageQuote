import { Client, Interaction, MessageEmbed } from 'discord.js';

function createPing(client: Client, interaction: Interaction) {
  const pingReady = new MessageEmbed()
    .setTitle('MessageQuote Ping:')
    .setDescription('Pinging... Please wait...')
    .setColor('YELLOW');
  const pingEmbed = new MessageEmbed()
    .setTitle('MessageQuote Ping:')
    .setDescription('🏓 Pong!')
    .addField('Latency(WebSocket):', `${client.ws.ping}ms`)
    .addField('Latency(API):', `${Date.now() - interaction.createdTimestamp}ms`)
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
