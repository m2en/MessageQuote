import Discord from "discord.js";
import dotenv from "dotenv";
import * as fs from "fs";
dotenv.config();

const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES"],
});

const TOKEN = process.env["TOKEN"];
if (TOKEN === null) {
  throw new Error("Env Null Error: Environment variable not found.");
}

client.login(TOKEN);

client.once("ready", () => {
  console.log(`Ready: ${client.user?.username}が準備完了しました。`);
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName === "help") {
    let help = fs.readFileSync("./src/message/help.txt", "utf8");
    let lines = help.toString().split("¥n");
    for (let line of lines) {
      interaction.reply({
        content: line,
        ephemeral: false,
      });
    }
  } else if (interaction.commandName === "ping") {
    interaction.reply({
      content: `<a:gif_ichiyo:709701170763137054>  ${client.ws.ping}ms <:isozaki_kirito:836249519632023623> `,
    });
  }
});
