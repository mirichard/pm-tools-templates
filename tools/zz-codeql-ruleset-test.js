// Throwaway fixture proving the CodeQL ruleset blocks risky PRs. DO NOT MERGE.
const express = require('express');
const app = express();

app.get('/run', (req, res) => {
  // Deliberately unsafe: user-controlled code injection.
  res.send(String(eval(req.query.code)));
});

module.exports = app;
