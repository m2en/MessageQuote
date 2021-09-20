import Discord from "discord.js";
import dotenv from "dotenv";
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
