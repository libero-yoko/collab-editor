import express from 'express';
import mutationsController from '../controllers/mutationsController.js'
const router = express.Router();

router.get('/', (req, res)=>{
  console.log('post mutations');
})

router.post('/', mutationsController.postMutations, (req, res)=>{
  res.status(201).send(res.locals.message);
})

export default router;