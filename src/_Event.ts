import Discord from "discord.js";

export default function Event(client: Discord.Client) {
  client.on("threadCreate", (thread) => {
    if (thread === null) {
      return;
    }
    thread.join().catch(console.error);
    thread
      .send({
        content: `<@${thread.ownerId}>, **スレッド:${thread.name}**に自動参加しました。スレッド内のメッセージを引用することが可能です。`,
      })
      .catch(console.error);
  });
}
