import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch';

dotenv.config();

const app = express();

// ✅ Enable CORS for all origins (temporary, safe for dev)
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// === ROUTE ===
app.post('/api/chat', async (req, res) => {
  try {
    const userMessages = req.body.messages;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: userMessages
      })
    });

    const data = await response.json();

    if (!data || !data.choices) {
      return res.status(500).json({ error: 'Invalid response from OpenRouter API.' });
    }

    res.json(data);
  } catch (error) {
    console.error('❌ SERVER ERROR:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
