import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import infoRouter from './routes/infoRouter.js'
import mutationsRouter from './routes/mutationsRouter.js'
import conversationsRouter from './routes/conversationsRouter.js'


const PORT = 3000;
const api = express();
const corsOptions = {
  origin: 'https://app.ava.me',
  methods: "POST",
  optionsSuccessStatus: 200 // for legacy browsers
};
/***************************** 
  Parsers and Static handlers
******************************/
api.use('/' , express.static('../client'));
api.use('/' , express.static('../build'));
api.use(express.json());
api.use(express.urlencoded({extended: true}));

/************************ 
  Route Handlers 
*************************/
api.get('/', (req, res) =>{
  res.status(200).sendFile(path.resolve('./index.html'));
});

api.get('/ping', (req, res) =>{
  res.status(200).send({'ok':true, 'msg':'pong'});
});

api.use('/info', infoRouter);
api.use('/mutations', mutationsRouter);
api.use('/conversations', conversationsRouter);

/************************ 
  Error Handlers 
*************************/
// catch-all route handler for any requests to an unknown route
api.use((req, res) => res.status(404).send("Error 404"));

// global error handler
api.use((err, req, res, next) => {
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
api.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

export default api;