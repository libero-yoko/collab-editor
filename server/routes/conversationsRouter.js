import express from 'express';

const router = express.Router();

router.get('/', (req, res)=>{
  res.status(200).send('get conversasions');
})

router.delete('/', (req, res)=>{
  res.status(200).send('delete conversasions');
})

export default router;