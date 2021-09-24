import Discord from "discord.js";
import fs from "fs";

const HELP_MESSAGE: string = fs.readFileSync("./src/message/help.txt", "utf-8");

export function Command(client: Discord.Client) {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    switch (interaction.commandName) {
      case "help":
        await interaction.reply({
          content: HELP_MESSAGE,
          ephemeral: false,
        });
        break;
      case "ping":
        await interaction.reply({
          content: `<a:gif_ichiyo:709701170763137054>  ${client.ws.ping}ms <:isozaki_kirito:836249519632023623> `,
        });
        break;
      case "debug":
        const debugContent = interaction.options.getString("content");
        await interaction.reply({
          content: "メッセージをデバッグします。\n\n" + `\`${debugContent}\``,
        });
    }
  });

  return "Command";
}
