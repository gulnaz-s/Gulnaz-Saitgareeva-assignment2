const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const cors = require("cors");
const path = require("path");
const { User, Tweet } = require("./models");
const { use } = require("passport");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/twitter_clone";

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const jwtSecret = "abracadabra";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.jwt]),
  secretOrKey: jwtSecret,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id);

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// Middleware to check for authentication
function auth(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    req.user = user || null;
    next();
  })(req, res, next);
}

// Routes

// GET /api/users/:username/feed
app.get("/api/users/:username/feed", async (req, res) => {
  try {
    const { params } = req;
    const { username } = params;

    // Look up for user case insensitive
    const user = await User.findOne({
      lowercaseUsername: username.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const feed = await Tweet.find({ username, deleted: false }).sort({
      timestamp: -1,
    });

    res.json({
      user: user.getPublicPart(),
      feed: feed.map((tweet) => tweet.getPublicPart()),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tweets
app.get("/api/tweets", async (req, res) => {
  try {
    const feed = await Tweet.find({ deleted: false }).sort({ timestamp: -1 });
    res.json({ feed: feed.map((tweet) => tweet.getPublicPart()) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().sort({ joined: -1 });
    res.json({ users: users.map((user) => user.getPublicPart()) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tweets
app.post("/api/tweets", auth, async (req, res) => {
  try {
    const { user, body } = req;
    if (user == null) {
      // Not authenticated
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { message } = body;
    const { username } = user;
    const tweet = new Tweet({
      username,
      message,
      timestamp: Math.floor(Date.now() / 1000),
    });

    await tweet.save();
    res.json({ tweet: tweet.getPublicPart() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/tweets/:id
app.put("/api/tweets/:id", auth, async (req, res) => {
  try {
    const { user, params, body } = req;
    if (user == null) {
      // Not authenticated
      return res.status(401).json({ error: "Not authenticated" });
    }

    let { message } = body;
    if (message == null) {
      return res.status(400).json({ error: "Missing message" });
    }

    message = message.trim();
    if (message.length === 0) {
      return res.status(400).json({ error: "Empty message" });
    }

    let tweet = await Tweet.findById(params.id);
    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    if (tweet.username !== user.username) {
      return res.status(403).json({ error: "Not authorized" });
    }

    tweet.message = message;
    tweet = await tweet.save();

    res.json({ tweet: tweet.getPublicPart() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/tweets/:id
app.delete("/api/tweets/:id", auth, async (req, res) => {
  try {
    const { user, params } = req;
    if (user == null) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const tweet = await Tweet.findById(params.id);
    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    if (tweet.username !== user.username) {
      return res.status(403).json({ error: "Not authorized" });
    }

    tweet.deleted = true;
    await tweet.save();

    res.json({});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/tweets/:id/restore
app.put("/api/tweets/:id/restore", auth, async (req, res) => {
  try {
    const { user, params } = req;
    if (user == null) {
      // Not authenticated
      return res.status(401).json({ error: "Not authenticated" });
    }

    const tweet = await Tweet.findById(params.id);
    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    if (tweet.username !== user.username) {
      return res.status(403).json({ error: "Not authorized" });
    }

    tweet.deleted = false;
    await tweet.save();

    res.json({ tweet: tweet.getPublicPart() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/login
app.post("/api/login", async (req, res) => {
  try {
    const { body } = req;
    const { username, password } = body;

    if (username == null || password == null) {
      return res.status(400).json({ error: "Missing username or password" });
    }

    const user = await User.findOne({
      lowercaseUsername: username.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({ error: `User @${username} not found` });
    }

    const pwdOk = await bcrypt.compare(password, user.passwordHash);

    if (!pwdOk) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "1d" });
    res.cookie("jwt", token, { httpOnly: true });
    res.json({ user: user.getPublicPart() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/logout
app.post("/api/logout", async (req, res) => {
  res.clearCookie("jwt");
  res.json({});
});

// POST /api/signup
app.post("/api/signup", async (req, res) => {
  try {
    const { body } = req;
    const { username, password } = body;

    const existingUser = await User.findOne({
      lowercaseUsername: username.toLowerCase(),
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: `Username @${username} is already taken` });
    }

    if (username == null || password == null) {
      return res.status(400).json({ error: "Missing username or password" });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({
        error:
          "Invalid username. Only alphanumeric characters and underscores are allowed.",
      });
    }

    if (password.length === 0) {
      return res.status(400).json({ error: "Empty password is not allowed" });
    }

    const user = new User({
      username: username,
      lowercaseUsername: username.toLowerCase(),
      passwordHash: await bcrypt.hash(password, 10),
      joined: Math.floor(Date.now() / 1000),
      description: "",
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "1d" });
    res.cookie("jwt", token, { httpOnly: true });
    res.json({ user: user.getPublicPart() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/me
app.get("/api/me", auth, async (req, res) => {
  try {
    res.json({ user: req.user?.getPublicPart() || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/me/description
app.put("/api/me/description", auth, async (req, res) => {
  try {
    let { user, body } = req;
    if (user == null) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { description } = body;
    user.description = description;
    user = await user.save();

    res.json({ user: user.getPublicPart() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Static site

let frontend_dir = path.join(__dirname, "..", "frontend", "dist");

app.use(express.static(frontend_dir));
app.get("*", function (req, res) {
  console.log("received request");
  res.sendFile(path.join(frontend_dir, "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
