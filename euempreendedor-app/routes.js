import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NovoOrcamento from './pages/NovoOrcamento';
import Orcamentos from './pages/Orcamentos';

const Stack = createNativeStackNavigator();

export default function Routes(){
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Login'>
                <Stack.Screen name='Login' component={Login} options={{headerShown: false}}/>
                <Stack.Screen name='Dashboard' component={Dashboard} options={{headerShown: false}}/>
                <Stack.Screen name='Orcamentos' component={Orcamentos} options={{headerShown: false}}/>
                <Stack.Screen name='NovoOrcamento' component={NovoOrcamento} options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

