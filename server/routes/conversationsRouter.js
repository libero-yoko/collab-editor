import express from 'express';
import conversationsController from '../controllers/conversationsController.js'
const router = express.Router();

router.get('/', conversationsController.getConversations, (req, res)=>{
  res.status(200).send(res.locals.message);
})

router.delete('/:id*?', conversationsController.deleteConversation, (req, res)=>{
  console.log(res.locals.message)
  res.status(204).send(res.locals.message);
})

export default router;