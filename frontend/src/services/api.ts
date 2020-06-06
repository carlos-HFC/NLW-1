import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8000' })

const ibge = axios.create({ baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades' })

export { api, ibge }