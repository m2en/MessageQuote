const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display help. / ヘルプを表示します。')
}
