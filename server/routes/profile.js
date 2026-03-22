const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');
const auth = require('../middleware/auth');

const sanitizeString = (val) => (typeof val === 'string' ? val.trim().slice(0, 500) : undefined);
const sanitizeArray = (arr) => Array.isArray(arr) ? arr.map(s => typeof s === 'string' ? s.trim().slice(0, 200) : '').filter(Boolean) : [];


router.get('/', auth, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ owner: req.user.id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch {
    res.status(500).json({ message: 'Server Error' });
  }
});


router.post('/', auth, async (req, res) => {
  const b = req.body;

  
  const profileFields = {
    owner: req.user.id,
    personal: {
      name: sanitizeString(b.personal?.name),
      email: sanitizeString(b.personal?.email)?.toLowerCase(),
      phone: sanitizeString(b.personal?.phone),
      location: sanitizeString(b.personal?.location)
    },
    education: Array.isArray(b.education) ? b.education.map(e => ({
      degree: sanitizeString(e.degree),
      college: sanitizeString(e.college),
      cgpa: typeof e.cgpa === 'number' ? e.cgpa : parseFloat(e.cgpa) || undefined,
      year: sanitizeString(e.year)
    })) : [],
    skills: sanitizeArray(b.skills),
    projects: Array.isArray(b.projects) ? b.projects.map(p => ({
      name: sanitizeString(p.name),
      description: sanitizeString(p.description),
      techStack: sanitizeArray(p.techStack)
    })) : [],
    experience: Array.isArray(b.experience) ? b.experience.map(e => ({
      role: sanitizeString(e.role),
      company: sanitizeString(e.company),
      duration: sanitizeString(e.duration),
      description: sanitizeString(e.description)
    })) : [],
    achievements: sanitizeArray(b.achievements),
    research: sanitizeArray(b.research),
    extra: {
      strengths: sanitizeArray(b.extra?.strengths),
      weaknesses: sanitizeArray(b.extra?.weaknesses),
      goals: sanitizeString(b.extra?.goals),
      languages: sanitizeArray(b.extra?.languages)
    }
  };

  try {
    let profile = await UserProfile.findOne({ owner: req.user.id });

    if (profile) {
      
      profile = await UserProfile.findOneAndUpdate(
        { owner: req.user.id },
        { $set: profileFields },
        { new: true, runValidators: true }
      );
      return res.json(profile);
    }
    profile = new UserProfile(profileFields);
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    console.error('Error saving profile:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});



router.patch('/', auth, async (req, res) => {
  const b = req.body; 
  
  try {
    const updateQuery = {};
    const pushQuery = {};

    if (b.personal) updateQuery['personal'] = { ...b.personal };
    if (b.extra?.goals) updateQuery['extra.goals'] = b.extra.goals;

    
    if (b.skills) pushQuery['skills'] = { $each: b.skills };
    if (b.achievements) pushQuery['achievements'] = { $each: b.achievements };
    if (b.education) pushQuery['education'] = { $each: b.education };
    if (b.projects) pushQuery['projects'] = { $each: b.projects };
    if (b.experience) pushQuery['experience'] = { $each: b.experience };

    const finalQuery = {};
    if (Object.keys(updateQuery).length > 0) finalQuery['$set'] = updateQuery;
    if (Object.keys(pushQuery).length > 0) finalQuery['$addToSet'] = pushQuery;

    if (Object.keys(finalQuery).length === 0) {
      return res.status(400).json({ message: 'No valid update parameters provided' });
    }

    const profile = await UserProfile.findOneAndUpdate(
      { owner: req.user.id },
      finalQuery,
      { new: true, upsert: true }
    );

    res.json(profile);

  } catch (err) {
    console.error('PATCH profile error:', err.message);
    res.status(500).json({ message: 'Failed to apply delta update' });
  }
});

module.exports = router;
