import React, { useState, useEffect, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import Swal from 'sweetalert2'

import Dropzone from '../../components/Dropzone'
import logo from '../../assets/logo.svg'
import { api, ibge } from '../../services/api'

/* 
SEMPRE QUE SE CRIA UM ESTADO PARA UM ARRAY OU OBJETO, É NECESSÁRIO INFORMAR O TIPO DA VARIÁVEL
*/

interface Item {
   id: number;
   title: string;
   image_url: string;
}

interface UF {
   id: number;
   sigla: string;
}

interface City {
   id: number;
   nome: string;
}

const CreatePoint = () => {
   const history = useHistory()

   const [items, setItems] = useState<Item[]>([])
   const [uf, setUf] = useState<UF[]>([])
   const [cities, setCities] = useState<City[]>([])
   const [selectedUf, setSelectedUf] = useState('0')
   const [selectedCity, setSelectedCity] = useState('0')
   const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])
   const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])
   const [selectedItems, setSelectedItems] = useState<number[]>([])
   const [selectedFile, setSelectedFile] = useState<File>()

   const [inputData, setInputData] = useState({
      name: '',
      email: '',
      whatsapp: ''
   })

   //BUSCAR ITENS CADASTRADOS NO BANCO
   useEffect(() => {
      api.get('/items').then(({ data }) => setItems(data))
   }, [])

   //PEGAR OS ESTADOS
   useEffect(() => {
      ibge.get('/estados').then(({ data }) => setUf(data.sort((a: any, b: any) => a.sigla < b.sigla ? -1 : 1)))
   }, [])

   //PEGAR AS CIDADES A PARTIR DO ESTADO SELECIONADO
   useEffect(() => {
      if (selectedUf === '0') return
      ibge.get(`/estados/${selectedUf}/municipios`).then(({ data }) => setCities(data.sort()))
   }, [selectedUf])

   //PEGAR LOCALIZAÇÃO ATUAL A PARTIR DO GPS
   useEffect(() => {
      if (initialPosition[0] === 0 && initialPosition[1] === 0) {
         setInitialPosition([-23.466842, -46.592503])
      } else {
         navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords
            setInitialPosition([latitude, longitude])
         })
      }
   }, [])

   //SELECIONAR OS ÍTENS DE COLETA
   function handleSelectItem(id: number) {
      const already = selectedItems.findIndex(item => item === id)

      if (already >= 0) {
         const filtered = selectedItems.filter(item => item !== id)
         setSelectedItems(filtered)
      } else {
         setSelectedItems([...selectedItems, id])
      }
   }

   async function handleSubmit(e: FormEvent) {
      e.preventDefault()

      const { name, email, whatsapp } = inputData
      const uf = selectedUf
      const city = selectedCity
      const [latitude, longitude] = selectedPosition
      const items = selectedItems

      const data = new FormData()

      data.append('name', name)
      data.append('email', email)
      data.append('whatsapp', whatsapp)
      data.append('uf', uf)
      data.append('city', city)
      data.append('latitude', String(latitude))
      data.append('longitude', String(longitude))
      data.append('items', items.join(','))

      if (selectedFile) {
         data.append('image', selectedFile)
      }

      await api.post('/points', data)

      await Swal.fire({
         title: 'Cadastro concluído',
         icon: 'success',
         timer: 1500,
         showConfirmButton: false,
      })

      return history.push('/')
   }

   return (
      <div id="page-create-point">
         <header>
            <img src={logo} alt="Ecoleta" />
            <Link to="/">
               <FiArrowLeft />
               Voltar para home
            </Link>
         </header>

         <form onSubmit={handleSubmit}>
            <h1>Cadastro do <br /> ponto de coleta</h1>

            <Dropzone onFileUploaded={setSelectedFile} />

            <fieldset>
               <legend>
                  <h2>Dados</h2>
               </legend>

               <div className="field">
                  <label htmlFor="name">Nome da entidade</label>
                  <input type="text" name="name" id="name"
                     onChange={e => setInputData({
                        ...inputData, [e.target.name]: e.target.value
                     })} autoComplete="new" />
               </div>

               <div className="field-group">
                  <div className="field">
                     <label htmlFor="email">E-mail</label>
                     <input type="email" name="email" id="name"
                        onChange={e => setInputData({
                           ...inputData, [e.target.name]: e.target.value
                        })} autoComplete="new" />
                  </div>
                  <div className="field">
                     <label htmlFor="whatsapp">Whatsapp</label>
                     <input type="text" name="whatsapp" id="whatsapp"
                        onChange={e => setInputData({
                           ...inputData, [e.target.name]: e.target.value
                        })} autoComplete="new" />
                  </div>
               </div>
            </fieldset>

            <fieldset>
               <legend>
                  <h2>Endereço</h2>
                  <span>Selecione o endereço no mapa</span>
               </legend>

               <Map center={initialPosition} zoom={15} onClick={(e: LeafletMouseEvent) => setSelectedPosition([e.latlng.lat, e.latlng.lng])}>
                  <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={selectedPosition} />
               </Map>

               <div className="field-group">
                  <div className="field">
                     <label htmlFor="uf">Estado (UF)</label>
                     <select name="uf" id="uf" value={selectedUf} onChange={e => setSelectedUf(e.target.value)}>
                        <option value="0">Selecione uma UF</option>
                        {
                           uf.map(uf => <option key={uf.id} value={uf.sigla}>{uf.sigla}</option>)
                        }
                     </select>
                  </div>
                  <div className="field">
                     <label htmlFor="city">Cidade</label>
                     <select name="city" id="city" value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
                        <option value="0">Selecione uma cidade</option>
                        {
                           cities.map(city => <option key={city.id} value={city.nome}>{city.nome}</option>)
                        }
                     </select>
                  </div>
               </div>
            </fieldset>

            <fieldset>
               <legend>
                  <h2>Ítens de coleta</h2>
                  <span>Selecione um ou mais ítens abaixo</span>
               </legend>

               <ul className="items-grid">
                  {
                     items.map(item => (
                        <li key={item.id}
                           onClick={() => handleSelectItem(item.id)}
                           className={selectedItems.includes(item.id) ? 'selected' : ''}
                        >
                           <img src={item.image_url} alt={item.title} />
                           <span>{item.title}</span>
                        </li>
                     ))
                  }
               </ul>
            </fieldset>

            <button type="submit">
               Cadastrar ponto de coleta
            </button>
         </form>
      </div>
   )
}

export default CreatePoint
