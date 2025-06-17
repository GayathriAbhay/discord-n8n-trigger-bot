require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

client.once("ready", () => {
  console.log(` Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  // Avoid bot loops
  if (message.author.bot) return;

  try {
    // Send message data to n8n webhook
    await axios.post(process.env.WEBHOOK_URL, {
      username: message.author.username,
      userId: message.author.id,
      content: message.content,
      channelId: message.channel.id,
      timestamp: message.createdAt
    });

    console.log(" Message sent to n8n webhook:", message.content);
  } catch (err) {
    console.error(" Failed to POST to n8n:", err.message);
  }
});

client.login(process.env.DISCORD_TOKEN);
