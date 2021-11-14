const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("message-info")
        .setDescription("Check the information in the message. / メッセージの情報を確認します。")
        .addNumberOption((id) => id.setName('message_id').setDescription("Enter the ID of the message for which you want to check information. (Enable Developer Mode) / 情報を確認するメッセージのIDを入力してください。(開発者モードを有効)").setRequired(true))
};
