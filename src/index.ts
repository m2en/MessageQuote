import Discord from "discord.js";
import dotenv from "dotenv";
import * as fs from "fs";
dotenv.config();

const HELP_MESSAGE = fs.readFileSync("./src/message/help.txt", "utf-8");

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

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  //これにしなかった 死にます
  switch (interaction.commandName) {
    // ここコマンドごとに関数に分けたほうがいいような気もする
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
  }
});

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("https://discord.com/channels/")) {
    return;
  }
  /**
   * ~~~/channels/<serverid>/<channelid>/<messageid>
   */
  const splittedMessage = message.content.split("/");
  const channelID = splittedMessage[5];
  const channel = client.channels.cache.get(`${channelID}`);
  const messageID = splittedMessage[6];
  if (channel == null) {
    console.log("MQ Info: channel not found");
    message.channel.send("チャンネルがみつかりませんでした");
    return;
  }
  if (!channel.isText()) {
    message.channel.send("テキストチャンネルではありません");
    return;
  }
  const quoteEmbed = new Discord.MessageEmbed().setAuthor(
    `To ${message.author.tag}`
  );

  const fetched = await channel?.messages?.fetch(`${messageID}`);
  if (fetched == null) {
    console.log("MQ Info: message not found.");
    message.channel.send("メッセージが見つかりませんでした。");
    return;
  }

  fetched.channel
    .send({
      embeds: [
        quoteEmbed.setDescription(`${fetched.content}`).setColor("GREEN"),
      ],
    })
    .catch(console.error);
});
