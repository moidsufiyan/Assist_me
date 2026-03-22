const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');
const OpenAI = require('openai');
const auth = require('../middleware/auth');

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
}




router.post('/', auth, async (req, res) => {
  try {
    const { userQuery } = req.body;

    if (!userQuery || typeof userQuery !== 'string') {
      return res.status(400).json({ message: 'userQuery is required' });
    }

    if (userQuery.length > 1000) {
      return res.status(400).json({ message: 'Query exceeds 1000 characters' });
    }

    if (!openai) {
      return res.status(500).json({ message: 'AI Service is not configured properly.' });
    }

    
    const profile = await UserProfile.findOne({ owner: req.user.id });

    let profileDataString = "No profile data exists currently. Inform the user to create a profile first.";
    if (profile) {
      
      profileDataString = JSON.stringify(profile, null, 2);
    }

    
    const systemPrompt = `
You are an AI Assistant managing professional profiles.
Below is the user's current Profile Config:
${profileDataString}

Instructions:
1. Answer questions based ONLY on this profile data.
2. IF the user is telling you NEW facts about themselves (e.g., "I know React", "I worked at Google in 2023"), answer normally to confirm, BUT also output a JSON block inside an <UPDATE> tag at the absolute end.

Guidelines for <UPDATE> tag:
- Output only ONE <UPDATE> tag with valid JSON.
- Valid root keys: "personal", "education", "skills", "projects", "experience", "achievements", "extra".
- ONLY include the fields being updated.
- Array fields (like skills, projects) should be arrays containing the NEW items the user is adding.
- Example: <UPDATE>{ "skills": ["React", "CSS"] }</UPDATE>
- Be precise. The frontend parses this strictly.
`;

    
    const response = await openai.chat.completions.create({
      model: defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userQuery }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    let answer = response.choices[0].message.content;
    let proposedUpdate = null;

    
    const updateRegex = /<UPDATE>([\s\S]*?)<\/UPDATE>/;
    const match = answer.match(updateRegex);

    if (match && match[1]) {
      try {
        proposedUpdate = JSON.parse(match[1].trim());
        
        answer = answer.replace(updateRegex, '').trim();
      } catch (err) {
        console.error('Failed to parse AI update JSON:', err.message);
      }
    }

    res.json({ 
      answer,
      proposedUpdate 
    });

  } catch (err) {
    console.error('Error in chat API:', err);
    res.status(500).json({ message: `AI processing failed: ${err.message}` });
  }
});

module.exports = router;
