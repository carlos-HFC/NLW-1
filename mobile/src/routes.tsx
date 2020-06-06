import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
// NAVEGAÇÃO EM PILHA - CHAMA AS NOVAS TELAS E AS TELAS ANTERIORES NÃO DEIXAM DE EXISTIR
import { createStackNavigator } from '@react-navigation/stack'

import Home from './pages/Home/Index'
import Points from './pages/Points/Index'
import Detail from './pages/Detail/Index'

const Stack = createStackNavigator()

const Routes = () => {
   return (
      <NavigationContainer>
         <Stack.Navigator headerMode="none" screenOptions={{ cardStyle: { backgroundColor: '#F0F0F5' } }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Points" component={Points} />
            <Stack.Screen name="Detail" component={Detail} />
         </Stack.Navigator>
      </NavigationContainer>
   )
}

export default Routes