const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Usage: node mongo.js <password> [name] [number]');
  process.exit(1);
}

const password = process.argv[2];
const uri = `mongodb+srv://mkyam:${password}@cluster0.0s3n5bp.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(uri);

const peopleSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', peopleSchema);

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('Phonebook:');
    result.forEach(({ name, number }) => console.log(`${name} ${number}`));
    mongoose.connection.close();
  });
} else {
  const name = process.argv[3];
  const number = process.argv[4];
  const newPerson = new Person({ name, number });

  newPerson.save().then(result => {
    console.log(`Added ${result.name} number ${result.number} to phonebook.`);
    mongoose.connection.close();
  });
}