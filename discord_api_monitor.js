#!/usr/bin/env node
import dotenv from "dotenv";
import SendDiscordMessage from "send-discord-message";

dotenv.config();

// My Discord user ID
const USER_ID = "746007341572554882";

// Initialize the messenger with a Discord channel webhook
const messenger = new SendDiscordMessage(process.env.ALERTS_WEBHOOK_URL);

async function monitorAnimechanAPI() {
  try {
    const response = await fetch("https://api.animechan.io/ping");
    console.log(`API status: ${response.status} at ${new Date().toISOString()}`);
    if (!response.ok) {
      const message = `<@${USER_ID}> 🚨 Animechan API returned ${response.status} 🚨 Please look into it!`;
      await messenger.send(message);
    }
  } catch (error) {
    console.error("API check failed:", error.message);
  }
}

// Run every 10 minutes
setInterval(monitorAnimechanAPI, 10 * 60 * 1000);

// Run once immediately
monitorAnimechanAPI();
