const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');
const OpenAI = require('openai');

// Initialize the OpenAI client based on available API Keys in .env
let openai;
let defaultModel = process.env.GROQ_API_KEY ? 'llama-3.3-70b-versatile' : 'gpt-3.5-turbo';

if (process.env.GROQ_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
  });
} else if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
} else {
  console.warn("WARNING: Neither GROQ_API_KEY nor OPENAI_API_KEY is set in .env!");
}

// @route   POST /api/chat
// @desc    Process a user chat query using profile data
// @access  Public (for now)
router.post('/', async (req, res) => {
  try {
    const { userQuery } = req.body;

    if (!userQuery || typeof userQuery !== 'string') {
      return res.status(400).json({ message: 'userQuery is required' });
    }

    if (userQuery.length > 1000) {
      return res.status(400).json({ message: 'Query exceeds max length of 1000 characters' });
    }

    if (!openai) {
      return res.status(500).json({ message: 'AI Service is not configured properly in the backend.' });
    }

    // 1. Fetching the user profile from MongoDB
    const profile = await UserProfile.findOne();
    
    // We stringify the profile so the AI can read it. Exclude sensitive internal mongodb fields or keep it simple.
    let profileDataString = "No profile data exists currently. Inform the user to create a profile first.";
    if (profile) {
      // Exclude _id and __v for cleaner context
      const profileToContext = profile.toObject();
      delete profileToContext._id;
      delete profileToContext.__v;
      delete profileToContext.createdAt;
      delete profileToContext.updatedAt;
      profileDataString = JSON.stringify(profileToContext, null, 2);
    }

    // 2. Constructing the prompt as requested
    const systemPrompt = `You are a professional assistant helping a student fill job and college forms.
Rules:
Only use the provided user data
Do NOT invent any information
If data is missing, say 'Not provided'

User Data:
${profileDataString}`;

    // 3. Call the AI API
    const response = await openai.chat.completions.create({
      model: defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Question: ${userQuery}\n\nAnswer clearly and professionally.` }
      ],
      temperature: 0.2, // low temperature to promote factual consistency based on provided data
      max_tokens: 500
    });

    const aiAnswer = response.choices[0].message.content;

    // 4. Return the response
    res.json({ answer: aiAnswer });

  } catch (err) {
    console.error('Error in chat API:', err.message);
    res.status(500).json({ message: 'AI processing failed. Please try again.' });
  }
});

module.exports = router;
