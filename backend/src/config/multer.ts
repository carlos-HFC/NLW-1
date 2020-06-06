import { diskStorage } from 'multer'
import { resolve } from 'path'
import crypto from 'crypto'

export default {
   storage: diskStorage({
      destination: resolve(__dirname, '..', '..', 'uploads'),
      filename(req, file, cb) {
         //VAI GERAR CARACTERES ALEATÓRIOS EM HEXADECIMAL
         const hash = crypto.randomBytes(6).toString('hex')
         //NOME DO ARQUIVO (HASH GERADO COM O NOME ORIGINAL)
         const fileName = `${hash}-${file.originalname}`
         //PRIMEIRO PARÂMETRO É UM ERRO, O SEGUNDO O NOME DO ARQUIVO
         cb(null, fileName)
      }
   })
}