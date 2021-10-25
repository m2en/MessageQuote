import Discord from "discord.js";
import dotenv from "dotenv";
import { messageQ } from "./_messageQ";
import Event from "./_Event";
dotenv.config();

const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES"],
});

const TOKEN = process.env["TOKEN"];
if (TOKEN == null) {
  throw new Error("Env Null Error: Environment variable not found.");
}

client.login(TOKEN).catch(console.error);

client.once("ready", () => {
  console.log(`Ready: ${client.user?.username}が準備完了しました。`);
});

messageQ(client);
Event(client);
