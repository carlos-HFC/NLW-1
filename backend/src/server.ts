/* 
NECESSÁRIO INSTALAR OS TYPES DE ALGUMAS BIBLIOTECAS
*/
import express from 'express'
import cors from 'cors'
import { resolve } from 'path'
import { errors } from 'celebrate'

import routes from './routes'

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)

app.use('/uploads', express.static(resolve(__dirname, '..', 'uploads')))

app.use(errors())
app.listen(8000)