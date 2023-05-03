const express = require('express');
const app = express();
const PORT = 3001;

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find(person => person.id == id);

  if (!person) {
    return res.status(404).end();
  }

  res.json(person);
});

app.use('/api/persons', express.json());

app.post('/api/persons', (req, res) => {
  if (!(req.body.name && req.body.number)) {
    return res.status(400).json({
      error: 'Name and Number cannot be empty'
    });
  }

  const personExist = persons.find(person => {
    return person.name.toLowerCase() === req.body.name.toLowerCase();
  });

  if (personExist) {
    return res.status(400).json({
      error: 'This person is already in the phonebook.'
    });
  }

  const generateId = () => Math.floor(Math.random() * 1000);
  const { name, number } = req.body;
  const newPerson = {
    id: generateId(),
    name,
    number,
  };

  persons = [...persons, newPerson];
  res.json(newPerson);
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
