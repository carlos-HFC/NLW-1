import { Router } from 'express'
import multer from 'multer'
import { celebrate, Joi } from 'celebrate'

import config from './config/multer'
import Points from './controllers/PointsController'
import Items from './controllers/ItemsController'

const routes = Router()
const upload = multer(config)

/* ITENS COLETADOS */
//PEGAR OS ITENS
routes.get('/items', Items.index)

/* PONTOS DE COLETA */
//MOSTRAR TODOS OS PONTOS DE COLETA
routes.get('/points', Points.index)
//MOSTRAR APENAS UM ITEM
routes.get('/points/:id', Points.show)
//CRIAR PONTOS DE COLETA
//upload.single('<nome do campo>') - RECEBER UM ÚNICO ARQUIVO
routes.post(
   '/points',
   upload.single('image'),
   celebrate({
      body: Joi.object().keys({
         name: Joi.string().required(),
         email: Joi.string().required().email(),
         whatsapp: Joi.string().required(),
         latitude: Joi.number().required(),
         longitude: Joi.number().required(),
         city: Joi.string().required(),
         uf: Joi.string().required().max(2),
         items: Joi.string().required(),
      })
   }, {
      abortEarly: false
   }),
   Points.create
)

export default routes