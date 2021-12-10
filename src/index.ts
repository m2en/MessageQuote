import { Client } from "discord.js";
import dotenv from "dotenv";
import { _quote } from "./run/_quote";
import { _help } from "./command/help";
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
  console.log(
    `Ready: ${client.user?.username}が準備完了しました。 - v` +
      process.env.npm_package_version
  );
  client.user?.setActivity("v" + process.env.npm_package_version);
});

_quote(client);
_help(client);
