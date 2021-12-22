import { SlashCommandBuilder } from '@discordjs/builders'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription(
      'ヘルプを表示します。 / *help & メンションでも表示できます。'
    )
}
