const express = require("express");
const router = express.Router();
const User = require("../model/user");
const Exercise = require("../model/exercise");

router.post("/users", async (req, res) => {
  try {
    const user = new User({ username: req.body.username });
    await user.save();
    res.status(201).json({ username: user.username, _id: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "username _id");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/users/:_id/exercises", async (req, res) => {
  try {
    const user = await User.findById(req.params._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const exercise = new Exercise({
      description: req.body.description,
      duration: req.body.duration,
      date: req.body.date ? new Date(req.body.date) : new Date(),
      user: user._id,
    });

    await exercise.save();
    res.status(201).json({
      username: user.username,
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString(),
      _id: user._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/users/:_id/logs", async (req, res) => {
  try {
    const user = await User.findById(req.params._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { from, to, limit } = req.query;
    const query = { user: user._id };

    if (from) {
      query.date = { ...query.date, $gte: new Date(from) };
    }
    if (to) {
      query.date = { ...query.date, $lte: new Date(to) };
    }

    const exercises = await Exercise.find(query).limit(parseInt(limit)).exec();

    res.status(200).json({
      username: user.username,
      count: exercises.length,
      _id: user._id,
      log: exercises.map((ex) => ({
        description: ex.description,
        duration: ex.duration,
        date: ex.date.toDateString(),
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


