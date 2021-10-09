const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("debug")
    .setDescription("文字列をデバックします。")
    .addStringOption((option) =>
      option
        .setName("content")
        .setDescription("文字列を指定します。")
        .setRequired(true)
    ),
};
