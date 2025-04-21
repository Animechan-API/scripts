#!/usr/bin/env node
import dotenv from "dotenv";

dotenv.config();

const WEBHOOK_URL = process.env.ALERTS_WEBHOOK_URL;
const API_URL = "https://api.animechan.io/ping";
const USER_ID = "746007341572554882";

// Function to send message to Discord webhook
async function sendToDiscord(message) {
  if (!WEBHOOK_URL) {
    console.error("Error: ALERTS_WEBHOOK_URL is not defined in .env");
    return;
  }
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message }),
    });
    if (response.ok) {
      console.log("Sent message to Discord");
    } else {
      console.error("Discord webhook failed:", response.status, await response.text());
    }
  } catch (error) {
    console.error("Failed to send to Discord:", error.message);
  }
}

// Function to check API and send Discord message on 500 error
async function checkApi() {
  try {
    const response = await fetch(API_URL);
    console.log(`API status: ${response.status} at ${new Date().toISOString()}`);
    await sendToDiscord(
      `<@${USER_ID}> 🚨 Animechan API returned 500 🚨 Please look into it!`,
    );
  } catch (error) {
    console.error("API check failed:", error.message);
  }
}

// Run every 10 minutes
setInterval(checkApi, 10 * 60 * 1000);

// Run once immediately
checkApi();
