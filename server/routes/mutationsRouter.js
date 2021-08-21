import express from 'express';

const router = express.Router();

router.get('/', (req, res)=>{
  console.log('post mutations');
})

router.post('/', (req, res)=>{
  console.log('post mutations');
  res.status(200).send('post mutations');
})

export default router;