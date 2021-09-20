const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const commands = [];
const commandsFile = path.join(__dirname, "command");
const cmdFile = fs
  .readdirSync(commandsFile)
  .filter((file) => file.endsWith(".js"));

const clientId = "889343802433757185";
const guildId = "683939861539192860";

for (const file of cmdFile) {
  const command = require(`./command/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
