import Discord from "discord.js";

export default function Event(client: Discord.Client) {
  client.on("threadCreate", (thread) => {
    if (thread === null) {
      return;
    }
    thread.join().catch(console.error);
    thread
      .send({
        content: `<@${thread.ownerId}>, スレッドに自動参加しました。`,
      })
      .catch(console.error);
  });
}
