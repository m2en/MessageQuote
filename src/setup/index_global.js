const { REST } = require("@discordjs/builders");
const { Routes } = require("discord-api-types/v9");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const commands = [];
const commandFiles = path.join(__dirname, "commands");
const commandFile = fs
  .readdirSync(commandFiles)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFile) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const client = process.env["clientID"];
const guild = process.env["guildID"];
const token = process.env["TOKEN"];
if ([client, guild, token].includes(undefined)) {
  throw new Error("環境変数の読み込みに失敗しました。");
}

const rest = new REST({ version: "9" }).setToken(token);

(async () => {
  try {
    console.log("グローバル方式のslash (/) command の登録を開始します。");
    await rest.put(Routes.applicationCommands(client), {
      body: commands
    })
    console.log("グローバル方式のslash (/) command の登録が完了しました。");
  } catch (commandRefreshError) {
    console.error(
      "グローバル方式のslash (/) command の登録中にエラーが発生しました。: commandRefreshError"
    );
    console.error(commandRefreshError);
  }
})();
