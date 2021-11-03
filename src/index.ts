import { Client } from "discord.js";
import dotenv from "dotenv";
import { _quote } from "./run/_quote";
import { _rt } from "./run/gtimes/_rt";
dotenv.config();

const client = new Client({
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

_quote(client);
_rt(client);
