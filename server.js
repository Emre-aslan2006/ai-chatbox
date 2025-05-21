import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch'; // Needed for Render

dotenv.config();

const app = express();

// CORS CONFIG: Replace with your actual frontend GitHub Pages domain
app.use(cors({
  origin: 'https://emre-aslan2006.github.io',
  methods: ['POST'],
  credentials: false
}));

app.use(express.json());

// MAIN API ENDPOINT
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
      console.error('Invalid API response:', data);
      return res.status(500).json({ error: 'Invalid response from OpenRouter' });
    }

    res.json(data);

  } catch (error) {
    console.error('SERVER ERROR:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// BASE ROUTE (optional)
app.get('/', (req, res) => {
  res.send('AI Chatbox Backend is Live');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
