import express from 'express';
import mutationsController from '../controllers/mutationsController.js'
const router = express.Router();

router.get('/', (req, res)=>{
  console.log('post mutations');
})

router.post('/', mutationsController.postMutations, (err, req, res)=>{
  if(err){
    res.status(400).send(res.locals.message);
  }
  res.status(201).send(res.locals.message);
})

export default router;