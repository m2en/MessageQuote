const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("debug")
    .setDescription("Debugging messages.")
    .addStringOption((option) =>
      option
        .setName("content")
        .setDescription("Specify the message to debug.")
        .setRequired(true)
    ),
};
