const express = require('express');

const app = express();

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
  response.json(contacts);
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
