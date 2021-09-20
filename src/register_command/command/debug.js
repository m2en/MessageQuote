const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("debug")
    .setDescription("Debugging messages.")
    .addIntegerOption((options) =>
      options
        .setName("id")
        .setDescription("Specify the message ID for debugging.")
        .setRequired(true)
    ),
};
