import Discord from "discord.js";
import ErrorInfo from "./message/error/error.json";

export function messageQ(client: Discord.Client) {
  client.on("messageCreate", async (message) => {
    const regex = /https:\/\/discord.com\/channels\/[0-9]+\/([0-9]+)\/([0-9]+)/;
    const str = message.content;
    str.replace(/[^0-9]/g, "");
    const splitMessage = message.content.split("/");

    const match = str.match(regex);
    if (message.author.bot || match == null) return;
    const channelID = match[1];
    const messageID = match[2];

    const channel = client.channels.cache.get(`${channelID}`);
    const errorEmbed = new Discord.MessageEmbed()
      .setTitle("お例外がお呼ばれされました")
      .setColor("RED");
    if (channel == null) {
      console.error(ErrorInfo.notFound);
      await message.reply({
        embeds: [errorEmbed.setDescription(ErrorInfo.notFound)],
      });
      return;
    }
    if (!channel.isText()) {
      console.error(ErrorInfo.notText);
      await message.reply({
        embeds: [errorEmbed.setDescription(ErrorInfo.notText)],
      });
      return;
    }

    const fetchMessage = await channel?.messages
      ?.fetch(`${messageID}`)
      .catch(console.error);

    if (fetchMessage == null) {
      message.channel.sendTyping();
      message.channel.send(
        "引用に失敗しました。開発者はこのエラーを認知しており、修正するために頑張ってます。\n<https://github.com/approvers/MessageQuote/issues/7>"
      );
      return;
    }
    if (fetchMessage.system) {
      await message.reply({
        embeds: [
          errorEmbed.setDescription(
            "システムメッセージのため引用をキャンセルしました。"
          ),
        ],
      });
      return;
    }

    const quoteEmbed = new Discord.MessageEmbed()
      .setDescription(`${fetchMessage.content}`)
      .setColor("AQUA")
      .setAuthor(
        `${fetchMessage.author.username}`,
        `${fetchMessage.author.avatarURL()}`
      )
      .setTimestamp();
    try {
      if (fetchMessage.attachments.size) {
        const file = fetchMessage.attachments.map(
          (attachment) => attachment.url
        );
        await message.reply({
          embeds: [quoteEmbed.setImage(`${file}`)],
        });
      } else {
        await message.reply({
          embeds: [quoteEmbed],
        });
      }
    } catch (error) {
      await message.reply({
        embeds: [
          errorEmbed
            .setDescription(ErrorInfo.AllErrors)
            .addField("Reason for error", "```\n" + error + "\n```"),
        ],
      });
      console.error(error);
    }
  });

  // 引用する - ContextMenuの処理 //
  client.on("interactionCreate", (interaction) => {
    if (!interaction.isContextMenu()) return;
    if (interaction.targetId === "引用する") {
      const contextMessage = interaction.options.getMessage("引用する");
      if (contextMessage === null) {
        return;
      }
      try {
        interaction.reply({
          embeds: [
            new Discord.MessageEmbed()
              .setDescription(`${contextMessage}`)
              .setAuthor(`${contextMessage.author}`)
              .setColor("AQUA"),
          ],
        });
      } catch (error) {
        return;
      }
    }
  });
}
