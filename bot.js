
import dotenv from 'dotenv';
dotenv.config();
import { Client, Events, GatewayIntentBits } from 'discord.js';


const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ] 
});

client.on(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
});

// Listen for text messages and respond to "ping" with "Pong!"
client.on(Events.MessageCreate, async message => {
  // Ignore messages from bots (including itself)
  if (message.author.bot) return;

  if (message.content.toLowerCase() === 'ping') {
    await message.reply('Pong!');
  }
});

client.login(process.env.DISCORD_API_KEY);

