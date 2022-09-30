require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const errHandler = require('./error');

morgan.token('body', (req) => {
  return req.method === 'POST'
    ? JSON.stringify(req.body)
    : 'Request has no body';
});

const app = express();
const Contact = require('./models/contact');

app.use(express.json());
app.use(express.static('build'));
app.use(cors());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

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

app.post('/api/contacts', (req, res, next) => {
  console.log('Posting single contact');

  const body = req.body;

  const isInvalidMsg = isInvalidConctact(body);
  if (isInvalidMsg) {
    next({ name: 'InvalidContact', message: isInvalidMsg });
    return;
  }
  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact.save().then((savedContact) => {
    console.log('New contact created', savedContact);
    res.json(savedContact);
  });
});

app.delete('/api/contacts/:id', (req, res, next) => {
  const id = req.params.id;
  console.log('Deleting single contact with id: ', id);
  Contact.findByIdAndRemove(id)
    .then(() => res.status(204).end())
    .catch((error) => {
      next(error);
    });
});

app.use(errHandler);

const isInvalidConctact = (newContact) => {
  if (!newContact.name || !newContact.number) {
    return 'Contacts must have a name and a number';
  }

  // if (contacts.find((contact) => contact.name === newContact.name)) {
  //   return 'Contact must have a unique name';
  // }

  return null;
};

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
