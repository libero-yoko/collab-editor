import express from 'express';
import mutationsController from '../controllers/mutationsController.js'
const router = express.Router();

router.get('/', (req, res)=>{
  console.log('post mutations');
})

router.post('/', mutationsController.postMutations, (req, res)=>{
  res.status(200).send(res.locals.updatedString);
})

export default router;