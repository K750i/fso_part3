const express = require('express');
const morgan = require('morgan');
const People = require('./models/people');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('dist'));

app.use(morgan(function (tokens, req, res) {
  const data = JSON.stringify(req.body) || '';

  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    data
  ].join(' ');
}));

app.get('/api/persons', (req, res) => {
  People.find().then(result => {
    res.json(result);
  });
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  People
    .findById(id)
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        res.status(404).end();
      }
    })
    .catch(err => console.log(err.reason));
});

app.use('/api/persons', express.json());

app.post('/api/persons', (req, res) => {
  if (!(req.body.name && req.body.number)) {
    return res.status(400).json({
      error: 'Name and Number cannot be empty'
    });
  }

  People
    .create({ name: req.body.name, number: req.body.number })
    .then(result => res.json(result));
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;

  persons = persons.filter(person => person.id != id);
  res.status(204).end();
});

app.use('/info', (req, res, next) => {
  req.timeReceived = new Date();
  next();
});

app.get('/info', (req, res) => {
  let info = `<p>Phonebook has information for ${persons.length} people.<p>`;
  info += `<p>${req.timeReceived}</p>`;
  res.send(info);
});

app.listen(PORT, () => console.log(`Server started and listening on port ${PORT}`));
