require('dotenv').config();
const { default: mongoose } = require('mongoose');

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PWD}@cluster0.0s3n5bp.mongodb.net/phonebook?retryWrites=true&w=majority`;
mongoose.connect(uri);
mongoose.connection.on(
  'connected', () => console.log('Connected to MongoDB\'s phonebook database.')
);

const peopleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 3,
      required: true
    },
    number: {
      type: String,
      minLength: 8,
      validate: {
        validator: v => /^\d{2,3}-\d{6,}$/.test(v)
      }
    },
  },
  {
    strictQuery: false,
    toJSON: {
      transform: function (doc, retObj) {
        retObj.id = retObj._id.toString();
        delete retObj._id;
        delete retObj.__v;
      }
    }
  }
);

module.exports = mongoose.model('Person', peopleSchema);
