const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
require("dotenv").config();

const Profile = require("../models/Profile");
const User = require("../models/User");
const Post = require("../models/Post");
const Notification = require('../models/Notification');

// @route    GET api/profile/me
// @desc     Get current user's profile
// @access   Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      linkedin,
      github,
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    // Build social object - only LinkedIn and GitHub for professional focus
    profileFields.social = {};
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (github) profileFields.social.github = github;

    try {
      // Using upsert option (creates new doc if no match is found):
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) return res.status(400).json({ msg: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete("/", auth, async (req, res) => {
  try {
    // Remove user posts
    await Post.deleteMany({ user: req.user.id });
    
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required and needs to be from the past")
        .not()
        .isEmpty()
        .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } =
      req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });

    foundProfile.experience = foundProfile.experience.filter(
      (exp) => exp._id.toString() !== req.params.exp_id
    );

    await foundProfile.save();
    return res.status(200).json(foundProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldofstudy", "Field of study is required").not().isEmpty(),
      check("from", "From date is required and needs to be from the past")
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });
    foundProfile.education = foundProfile.education.filter(
      (edu) => edu._id.toString() !== req.params.edu_id
    );
    await foundProfile.save();
    return res.status(200).json(foundProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});

// @route    GET api/profile/github/:username
// @desc     Get user repos from GitHub
// @access   Public
router.get("/github/:username", async (req, res) => {
  try {
    const githubToken = process.env.GITHUB_TOKEN;

    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );
    
    const headers = {
      'user-agent': 'node.js'
    };

    // Add authorization if GitHub token is provided
    if (githubToken && githubToken !== 'your_github_personal_access_token') {
      headers.Authorization = `token ${githubToken}`;
    }

    const gitHubResponse = await fetch(uri, { headers });
    
    if (!gitHubResponse.ok) {
      return res.status(404).json({ msg: 'No GitHub profile found' });
    }

    const repos = await gitHubResponse.json();

    res.json(repos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/profile/follow/:user_id
// @desc     Follow a user
// @access   Private
router.put('/follow/:user_id', auth, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.user_id);
    const currentUser = await User.findById(req.user.id);
    if (!userToFollow) {
      return res.status(404).json({ msg: 'User not found' });
    }
    if (req.user.id === req.params.user_id) {
      return res.status(400).json({ msg: 'You cannot follow yourself' });
    }
    // Add to following/followers arrays
    const profileToFollow = await Profile.findOne({ user: req.params.user_id });
    const currentProfile = await Profile.findOne({ user: req.user.id });
    if (!profileToFollow.followers) profileToFollow.followers = [];
    if (!currentProfile.following) currentProfile.following = [];
    if (profileToFollow.followers.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Already following' });
    }
    profileToFollow.followers.unshift(req.user.id);
    currentProfile.following.unshift(req.params.user_id);
    await profileToFollow.save();
    await currentProfile.save();
    // Notification logic
    const notification = await Notification.create({
      user: req.params.user_id,
      type: 'follow',
      from: req.user.id,
      message: `${currentUser.name} started following you`
    });
    const io = req.app.get('io');
    io.to(req.params.user_id).emit('notification', notification);
    res.json({ msg: 'User followed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/profile/unfollow/:user_id
// @desc     Unfollow a user
// @access   Private
router.put('/unfollow/:user_id', auth, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.user_id);
    if (!userToUnfollow) {
      return res.status(404).json({ msg: 'User not found' });
    }
    if (req.user.id === req.params.user_id) {
      return res.status(400).json({ msg: 'You cannot unfollow yourself' });
    }
    const profileToUnfollow = await Profile.findOne({ user: req.params.user_id });
    const currentProfile = await Profile.findOne({ user: req.user.id });
    if (!profileToUnfollow.followers) profileToUnfollow.followers = [];
    if (!currentProfile.following) currentProfile.following = [];
    profileToUnfollow.followers = profileToUnfollow.followers.filter(
      (id) => id.toString() !== req.user.id
    );
    currentProfile.following = currentProfile.following.filter(
      (id) => id.toString() !== req.params.user_id
    );
    await profileToUnfollow.save();
    await currentProfile.save();
    res.json({ msg: 'User unfollowed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
