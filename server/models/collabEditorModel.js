import dotenv from 'dotenv'
dotenv.config();
import mongoose from 'mongoose';
const MONGO_URI = process.env.MONGOURL;

mongoose.connect(MONGO_URI, {
  // options for the connect method to parse the URI
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  // sets the name of the DB that our collections are part of
  dbName: 'petAdoption'
})
  .then(() => console.log('Connected to Mongo DB.'))
  .catch(err => console.log(err));

const Schema = mongoose.Schema;

const collabSchema = new Schema(
  {
    updated_text: {type: String, required:false},
    _id: {type: String,  required:true},
    lastMutation: [{
      author: {type: String,  required:false},
      data: {
        index: {type: Number,  required:false},
        length: {type: Number,  required:false},
        text: {type: String,  required:false},
        type: {type: String,  required:false},
      },
      origin: {
        alice: {type: Number,  required:false},
        bob: {type: Number,  required:false},
      },
      next: {type: Object, required: false}
    }]
  }
)


export default mongoose.model('collabEditors', collabSchema);

