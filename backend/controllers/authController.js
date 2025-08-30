const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

module.exports = {

  signup: async (req, res) => {
    try {
      const { name, company, username, password, role } = req.body;

      const existing = await User.findOne({ username });
      if (existing) return res.status(400).json({ msg: "User already exists" });

      const passwordHash = await bcrypt.hash(password, 10);

      const user = new User({ name, company, username, passwordHash, role });
      await user.save();

      res.status(201).json({ msg: "Signup successful" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }

    login: async (req, res) => {
      try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
        res.cookie("jwt", token, { httpOnly: true, secure: true, sameSite: "none" });
        res.json({ token, role: user.role });
      } catch (err) {
        res.status(500).json({ msg: err.message });
      }
    };
  }
};
