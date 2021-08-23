import express from 'express';
import conversationsController from '../controllers/conversationsController.js'
const router = express.Router();

router.get('/', conversationsController.getConversations, (req, res)=>{
  res.status(200).send(res.locals.message);
})

router.delete('/', (req, res)=>{
  res.status(200).send('delete conversasions');
})

export default router;