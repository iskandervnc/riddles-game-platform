'use strict';

const express = require('express');
const cors = require('cors');
const riddleDao = require('./database/riddleDao');
const userDao = require('./database/userDao');
const answerDao = require('./database/answerDao');
const { Riddle } = require('./objects/Riddle');
const { Answer } = require('./objects/Answer');
const validate = require('./validationUtilities/validationUtils');
const { body, validationResult } = require('express-validator');
const dayjs = require('dayjs');

// init express
const app = new express();
const port = 3001;

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// set up the middlewares
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(express.json()); // for parsing json request body

// Passport
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

// Passport: set up local strategy
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await userDao.getUser(username, password)
  if (!user)
    return cb(null, false, 'Incorrect username/password');

  return cb(null, user);
}));

app.use(session({
  secret: "Exam #2 : Solve My Riddle - Web Applications I",
  resave: false,
  saveUninitialized: false,
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

app.use(passport.authenticate('session'));

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authorized' });
}

// --------------- {APIs} --------------- //

// <<< GET APIs >>> //

// Retrieve all riddles in the database.
app.get('/api/riddles', async (req, res) => {
  try {
    let list = await riddleDao.listAllRiddles();
    return res.status(200).json(list).end();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: `Internal Server Error` }).end();
  }
});

// Retrieve riddle by id //
app.get('/api/riddle/:riddleID', isLoggedIn, async (req, res) => {
  try {
    let riddle = await riddleDao.getRiddleByID(req.params.riddleID);
    return res.status(200).json(riddle).end();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: `Internal Server Error` }).end();
  }
});

// Retrieve all riddles of specific user
app.get('/api/riddles/user', isLoggedIn, async (req, res) => {
  try {
    let list = await riddleDao.getRiddlesByUsername(req.user.username);
    return res.status(200).json(list).end();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: `Internal Server Error` }).end();
  }
});

// Retrieve all answers of specific riddle by id
app.get('/api/answers/riddle:riddleID', isLoggedIn, async (req, res) => {
  try {
    let list = await answerDao.getAnswersByRiddleID(req.params.riddleID);
    return res.status(200).json(list).end();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: `Internal Server Error` }).end();
  }
});

// Retrieve all answers of specific username
app.get('/api/answers/user', isLoggedIn, async (req, res) => {
  try {
    let list = await answerDao.getAnswersByUsername(req.user.username);
    return res.status(200).json(list).end();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: `Internal Server Error` }).end();
  }
});

// Retrieve top 3 ranked users
app.get('/api/scores/top', async (req, res) => {
  try {
    let list = await userDao.getTop3RankedUsers();
    return res.status(200).json(list).end();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: `Internal Server Error` }).end();
  }
});

// <<< POST APIs >>> //
app.post('/api/riddle', isLoggedIn,
  body('question').not().isEmpty(), body('correctResponse').not().isEmpty(), body('difficulty').not().isEmpty(), body('hint1').not().isEmpty(),
  body('hint2').not().isEmpty(), body('duration').not().isEmpty(),
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      let body = req.body;
      if (!(await validate.validateRiddle(new Riddle(undefined, body.question, body.correctResponse, body.difficulty, body.hint1, body.hint2, body.duration, "open", req.user.username)))) {
        return res.status(422).json({ error: "The selected riddle is not valid" });
      }
      const newRiddleID = await riddleDao.createNewRiddle(new Riddle(undefined, body.question, body.correctResponse, body.difficulty, body.hint1, body.hint2, body.duration, "open", req.user.username));
      if (newRiddleID) {
        return res.status(201).json(newRiddleID).end();
      } else {
        return res.status(503).json({ error: `Service Unavailable` }).end()
      }
    } catch (err) {
      console.log(err);
      return res.status(503).json({ error: `Service Unavailable` }).end();
    }
  });

async function updateRiddleStatusAndStartTimer(riddleID, answer, username) {

  const riddle = await riddleDao.getRiddleByID(riddleID);
  const answers = await answerDao.getAnswersByRiddleID(riddleID);

  const wait = (duration) => {
    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => {
          return resolve();
        }, (duration * 1000));
      } catch (error) {
        reject(error);
      }
    });
  }

  const setClosedTimeout = async (duration) => {
    await wait(duration);
    await riddleDao.updateStatus(riddleID);
  }

  if (answers.length === 1 && answers[0].author === username) {
    // ONLY ANSWER IS THE ONE JUST SENT
    let splittedAnswer = answer.split(" ");
    for (let sa of splittedAnswer) {
      if (sa.toLowerCase() === riddle.correctResponse.toLowerCase()) {
        // ANSWER IS CORRECT -> CLOSE RIDDLE
        await riddleDao.updateStatus(riddleID);
        return;
      }
    }
    // START TIMER AFTER FIRST WRONG ANSWER
    setClosedTimeout(riddle.duration);
    return;
  } else {
    let splittedAnswer = answer.split(" ");
    for (let sa of splittedAnswer) {
      if (sa.toLowerCase() === riddle.correctResponse.toLowerCase()) {
        // NOT THE FIRST ANSWER , CLOSE RIDDLE
        await riddleDao.updateStatus(riddleID);
        return;
      }
    }
    // DO NOTHING , WRONG ANSWER
    return;

  }
}

app.post('/api/answer', isLoggedIn,
  body('riddleID').not().isEmpty(), body('answer').not().isEmpty(),
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      let body = req.body;
      let now = dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]');
      const riddle = await riddleDao.getRiddleByID(body.riddleID);
      if (!(await validate.validateAnswer(new Answer(body.riddleID, body.answer, req.user.username, now), riddle))) {
        return res.status(422).json({ error: "The answer is not valid" });
      }
      const newAnswerID = await answerDao.createNewAnswer(new Answer(body.riddleID, body.answer, req.user.username, now));
      if (newAnswerID) {
        updateRiddleStatusAndStartTimer(body.riddleID, body.answer, req.user.username);
        return res.status(201).json(newAnswerID).end();
      } else {
        return res.status(503).json({ error: `Service Unavailable` }).end()
      }
    } catch (err) {
      console.log(err);
      return res.status(503).json({ error: `Service Unavailable` }).end();
    }
  });

// <<< PATCH APIs >>> //

// update user score by adding gained points
app.patch('/api/score', isLoggedIn,
  body('gainedPoints').not().isEmpty(),
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const gainedPoints = req.body.gainedPoints;
    try {
      if (!(await validate.validatePoints(gainedPoints))) {
        return res.status(422).json({ error: "The selected amount of points is not valid" });
      }
      userDao.updateScore(gainedPoints, req.user.username);
      return res.status(200).json("OK").end();
    } catch (err) {
      console.log(err);
      return res.status(503).json({ error: `Service Unavailable` }).end();
    }
  });

// --------------- {AUTHENTICATION APIs} --------------- //

// Create session ( LOGIN )
app.post('/api/sessions', passport.authenticate('local'), (req, res) => {
  res.status(201).json(req.user);
});
// GET /api/sessions/current - Retrieve session
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else
    res.status(401).json({ error: 'Not authenticated' });
});
// DELETE /api/session/current - Logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});