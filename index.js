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

app.get('/api/persons/:id', (req, res, next) => {
  People
    .findById(req.params.id)
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

app.use('/api/persons', express.json());

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  People
    .create({ name, number })
    .then(result => res.json(result));
});

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;

  People
    .findByIdAndUpdate(req.params.id, { name, number }, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson);
    })
    .catch(next);
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;

  People
    .deleteOne({ _id: id })
    .then(result => res.json(result))
    .catch(next);
});

app.use('/info', (req, res, next) => {
  req.timeReceived = new Date();
  next();
});

app.get('/info', (req, res) => {
  People
    .estimatedDocumentCount()
    .then(result => {
      let info = `<p>Phonebook has information for ${result} people.<p>`;
      info += `<p>${req.timeReceived}</p>`;
      res.send(info);
    });
});

app.use((err, req, res, next) => {
  console.log(JSON.stringify(err, null, 2));

  if (err.name === 'CastError') {
    return res.json({ error: 'INVALID ID: unable to cast to ObjectId' });
  }
  next(err);
});

app.listen(PORT, () => console.log(`Server started and listening on port ${PORT}`));
