const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  personal: {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      lowercase: true
    },
    phone: { 
      type: String 
    },
    location: { 
      type: String 
    }
  },
  education: [{
    degree: { type: String },
    college: { type: String },
    cgpa: { type: Number },
    year: { type: String } // Can fit ranges like "2021 - 2025" or exact "2024"
  }],
  skills: [{ 
    type: String 
  }],
  projects: [{
    name: { type: String },
    description: { type: String },
    techStack: [{ type: String }]
  }],
  experience: [{
    role: { type: String },
    company: { type: String },
    duration: { type: String }, // e.g., "6 months", "2023 - Present"
    description: { type: String }
  }],
  achievements: [{ 
    type: String 
  }],
  research: [{ 
    type: String 
  }],
  extra: {
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    goals: { type: String },
    languages: [{ type: String }]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
