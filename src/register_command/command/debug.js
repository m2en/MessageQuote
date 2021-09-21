const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("debug")
    .setDescription("Debugging messages.")
    .addIntegerOption((option) =>
      option
        .setName("id")
        .setDescription("Specify the message ID to debug.")
        .setRequired(true)
    ),
};
