import Login from './loginPage';
import Register from './registerPage';
import Profile from './profilePage';
import AddPost from './addPost';
import Home from "./homePage";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useContext } from 'react';
import { LoginContext } from '../../context/loginContext';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';
import LogoutButton from './logoutButton';
import DetailPost from './detailPage';
import MainTabs from './mainTabNavigator';
// import { LoginContext } from '../context/loginContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function StackNavigator() {
  const { isLogin } = useContext(LoginContext)
  // console.log(isLogin);
  // const isLogin = true

  // console.log(isLogin);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLogin ? (
          <>
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="DetailPost" component={DetailPost} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}