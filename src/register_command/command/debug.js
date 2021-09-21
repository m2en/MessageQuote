const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("debug")
    .setDescription("Debugging messages.")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("Specify the message ID to debug.")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(
          "Specify the channel on which the message to be debugged was sent."
        )
        .setRequired(true)
    ),
};
