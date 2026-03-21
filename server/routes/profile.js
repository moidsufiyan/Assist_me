const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');

const sanitizeString = (val) => (typeof val === 'string' ? val.trim().slice(0, 500) : undefined);
const sanitizeArray = (arr) => Array.isArray(arr) ? arr.map(s => typeof s === 'string' ? s.trim().slice(0, 200) : '').filter(Boolean) : [];

// @route   GET /api/profile
router.get('/', async (req, res) => {
  try {
    const profile = await UserProfile.findOne();
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/profile
router.post('/', async (req, res) => {
  const b = req.body;

  // Sanitize all string inputs before writing to DB
  const profileFields = {
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
    let profile = await UserProfile.findOne();
    if (profile) {
      profile = await UserProfile.findOneAndUpdate(
        { _id: profile._id },
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

module.exports = router;
