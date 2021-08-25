/************************************************ 
  Route: /info
*************************************************/

import express from 'express';
import infoController from '../controllers/infoController.js'
const router = express.Router();

router.get('/', infoController.getInfo, (req, res)=>{
  res.status(200).send(res.locals.info);
})

export default router;