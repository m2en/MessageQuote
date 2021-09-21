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

const errorEmbed = new Discord.MessageEmbed()
  .setTitle("エラーが発生しました。")
  .setColor("RED");

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  switch (interaction.commandName) {
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
    case "debug":
      const debugContent = interaction.options.getString("content");
      await interaction.reply({
        content: "メッセージをデバッグします。\n\n" + `\`${debugContent}\``,
      });
  }
});

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("https://discord.com/channels/")) {
    return;
  }
  const splittedMessage = message.content.split("/");
  const channelID = splittedMessage[5];
  const channel = client.channels.cache.get(`${channelID}`);
  const messageID = splittedMessage[6];
  if (channel == null) {
    console.log("MQ Info: channel not found");
    await message.reply({
      embeds: [
        errorEmbed.setDescription(
          "メッセージが見つかりませんでした。IDが正しいか、閲覧権限が有効か確認してください。"
        ),
      ],
    });
    return;
  }
  if (!channel.isText()) {
    message.channel.send("テキストチャンネルではありません");
    await message.reply({
      embeds: [
        errorEmbed.setDescription(
          "テキストチャンネルのメッセージURLではありません。スレッド・アナウンスチャンネル・ストアチャンネルのメッセージURLは取得できません。"
        ),
      ],
    });
    return;
  }

  const fetched = await channel?.messages?.fetch(`${messageID}`);
  if (fetched == null) {
    console.log("MQ Not Message: message not found.");
    await message.reply({
      embeds: [
        errorEmbed.setDescription(
          "メッセージが見つかりませんでした。IDが正しいか、確認してください。"
        ),
      ],
    });
    return;
  }

  message
    .reply({
      embeds: [
        new Discord.MessageEmbed()
          .setDescription(`${fetched.content}`)
          .setColor("GREEN")
          .setAuthor(
            `${fetched.author.username}`,
            `${fetched.author.avatarURL()}`
          ),
      ],
    })
    .catch(console.error);
});
