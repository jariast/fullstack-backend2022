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
  Contact.find({}).then((contacts) => {
    const date = Date();

    const contactsNumber = contacts.length ?? 0;
    response.send(
      `<p>Phonebook has ${contactsNumber} contacts</p><p>${date.toString()}</p>`
    );
  });
});

app.get('/api/contacts', (request, response) => {
  console.log('Getting all contacts');
  Contact.find({}).then((contacts) => {
    response.json(contacts);
  });
});

app.get('/api/contacts/:id', (req, res) => {
  console.log('Getting single contact');
  const id = req.params.id;
  Contact.findById(id).then((contact) => {
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).end();
    }
  });
});

app.post('/api/contacts', (req, res, next) => {
  console.log('Posting single contact');

  const body = req.body;

  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact
    .save()
    .then((savedContact) => {
      console.log('New contact created', savedContact);
      res.json(savedContact);
    })
    .catch((error) => next(error));
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

app.put('/api/contacts/:id', (req, res, next) => {
  const id = req.params.id;
  const resBody = req.body;

  const contact = {
    name: resBody.name,
    number: resBody.number,
  };

  Contact.findByIdAndUpdate(id, contact, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedContact) => res.json(updatedContact))
    .catch((error) => next(error));
});

app.use(errHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
