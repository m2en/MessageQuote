import Discord from "discord.js";
import dotenv from "dotenv";
import { Command } from "./_Command";
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

async function onReady() {
  await client.application?.commands.set(
    [
      {
        name: "引用する",
        type: "MESSAGE",
      },
    ],
    "683939861539192860"
  );
}

client.once("ready", () => {
  console.log(`Ready: ${client.user?.username}が準備完了しました。`);
  onReady().catch(console.error); // ContentMenuの登録操作
});

messageQ(client);
Command(client);
Event(client);
