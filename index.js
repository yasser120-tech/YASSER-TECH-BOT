import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// VERIFY WEBHOOK
app.get("/webhook", (req, res) => {
  const verify_token = "yasser_token";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === verify_token) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// HANDLE MESSAGES
app.post("/webhook", async (req, res) => {
  try {
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message) {
      const phone = message.from; 
      const text = message.text?.body || "";

      await sendMessage(phone, "Hello! 👋 This is YASSER TECH bot.\n\nUmesema: " + text);
    }

    res.sendStatus(200);
  } catch (e) {
    console.log("Error:", e);
    res.sendStatus(500);
  }
});

// SEND MESSAGE FUNCTION
async function sendMessage(to, message) {
  await fetch(`https://graph.facebook.com/v17.0/YOUR_PHONE_ID/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer YOUR_ACCESS_TOKEN`
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      text: { body: message }
    })
  });
}

app.listen(3000, () => console.log("Bot is running"));