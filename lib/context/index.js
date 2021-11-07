const Discord = require("discord.js");
const client = new Discord.Client({
  intents: 0,
});

const guild = process.env["guildID"];
if (guild === undefined) {
  throw new Error("環境変数を指定していません。");
}

async function _registerContext() {
  await client.application.commands.set(
    [
      {
        type: "USER",
        name: "RTする",
      },
    ],
    guild
  );
}
