/* 
React.FC - FUNCTION COMPONENT
interface - FORMA DE DEFINIR A TIPAGEM DE UM OBJETO

SE A PROPRIEDADE FOR OBRIGATÓRIA, <nome da propriedade>: <tipo da propriedade>
SE A PROPRIEDADE FOR OPCIONAL, <nome da propriedade>?: <tipo da propriedade>
QUANDO FOR OPCIONAL, ADICIONO O PONTO DE INTERROGAÇÃO (?)

defaultProps - DEFINIR A PROPRIEDADE UM VALOR PADRÃO CASO ELA ESTEJA VAZIA
*/

import React from 'react'

interface HeaderProps {
   title?: string
}

const Header: React.FC<HeaderProps> = ({ title }) => {
   return (
      <header>
         <h1>{title}</h1>
      </header>
   )
}

Header.defaultProps = {
   title: "Ecoleta"
}

export default Header
