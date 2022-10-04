const mongoose = require('mongoose');

const consoleArgs = process.argv;

if (process.argv.length < 3) {
  console.log('Please provide the mmongoDB password: node mongo.js <password>');
  process.exit(1);
}

const pass = consoleArgs[2];

const url = `mongodb+srv://fullstack2022:${pass}@clusterfullstack.lrhpiaz.mongodb.net/?retryWrites=true&w=majority`;

const contactSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Contact = mongoose.model('Contact', contactSchema);

const connectAndOperatetoDB = (dbOperation) => {
  mongoose.connect(url).then(() => {
    console.log('Connected to Mongo');
    return dbOperation();
  });
};

const saveContact = () => {
  console.log('Saving contact');
  const contact = new Contact({ name: consoleArgs[3], number: consoleArgs[4] });
  contact.save().then(() => {
    console.log('Contact Saved');
    return mongoose.connection.close();
  });
};

const getContacts = () => {
  console.log('Getting all contacts');
  Contact.find({}).then((contacts) => {
    contacts.forEach((contact) => console.log(contact));
    return mongoose.connection.close();
  });
};

if (consoleArgs.length === 5) {
  connectAndOperatetoDB(saveContact);
} else {
  connectAndOperatetoDB(getContacts);
}
