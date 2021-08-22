const mongoose = require('mongoose');
const MONGO_URI = "mongodb+srv://libero-user01:2rNHhDvStc5CAQRI@cluster0.1cdsw.mongodb.net/petAdoption?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI, {
  // options for the connect method to parse the URI
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // sets the name of the DB that our collections are part of
  dbName: 'petAdoption'
})
  .then(() => console.log('Connected to Mongo DB.'))
  .catch(err => console.log(err));

const Schema = mongoose.Schema;

const petSchema = new Schema({
  name: String,
  age:  Number,
  breed: String,
  weight: Number,
  litterbox_trained: String,
  introduction: String,
})


module.exports = mongoose.model('Pet', petSchema);

