import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import infoRouter from './routes/infoRouter.js'
import mutationsRouter from './routes/mutationsRouter.js'
import conversationsRouter from './routes/conversationsRouter.js'

const PORT = 3000;
const app = express();
const corsOptions = {
  origin: 'https://app.ava.me',
  methods: "POST",
  optionsSuccessStatus: 200 // for legacy browsers
};

app.use(cors(corsOptions))

/***************************** 
  Parsers and Static handlers
******************************/
app.use('/' , express.static('../client'));
app.use('/' , express.static('../build'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/************************ 
  Route Handlers 
*************************/
app.get('/', (req, res) =>{
  res.status(200).sendFile(path.resolve('./index.html'));
});

app.get('/ping', (req, res) =>{
  res.status(200).send({'ok':true, 'msg':'pong'});
});

app.use('/info', infoRouter);
app.use('/mutations', mutationsRouter);
app.use('/conversations', conversationsRouter);

/************************ 
  Error Handlers 
*************************/
// catch-all route handler for any requests to an unknown route
app.use((req, res) => res.status(404).send("Error 404"));

// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 500,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

/************************ 
  Starting Server
*************************/
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

export default app;