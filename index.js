require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

morgan.token('body', (req) => {
  return req.method === 'POST'
    ? JSON.stringify(req.body)
    : 'Request has no body';
});

const app = express();
const Contact = require('./models/contact');
const { response } = require('express');

app.use(express.json());
app.use(express.static('build'));
app.use(cors());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

let contacts = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/info', (request, response) => {
  console.log('Getting Info');
  const contactsNumber = contacts.length;
  const date = Date();
  response.send(
    `<p>Phonebook has ${contactsNumber} contacts</p><p>${date.toString()}</p>`
  );
});

app.get('/api/contacts', (request, response) => {
  console.log('Getting all contacts');
  Contact.find({}).then((contacts) => {
    response.json(contacts);
  });
});

app.get('/api/contacts/:id', (req, res) => {
  console.log('Getting single contact');
  const id = Number(req.params.id);
  const contact = contacts.find((contact) => contact.id === id);
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).end();
  }
});

app.post('/api/contacts', (req, res) => {
  console.log('Posting single contact');
  // const id = Math.floor(Math.random() * 99999);

  // const newContact = { id, ...req.body };

  const body = req.body;

  const isInvalidMsg = isInvalidConctact(body);
  if (isInvalidMsg) {
    res.status(400).json({ error: isInvalidMsg });
    return;
  }
  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact.save().then((savedContact) => {
    res.json(savedContact);
  });

  // contacts = contacts.concat(newContact);

  // res.json(newContact);
});

app.delete('/api/contacts/:id', (req, res) => {
  console.log('Deleting single contact');
  const id = Number(req.params.id);
  contacts = contacts.filter((contact) => contact.id !== id);
  res.status(204).end();
});

const isInvalidConctact = (newContact) => {
  if (!newContact.name || !newContact.number) {
    return 'Contacts must have a name and a number';
  }

  if (contacts.find((contact) => contact.name === newContact.name)) {
    return 'Contact must have a unique name';
  }

  return null;
};

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
