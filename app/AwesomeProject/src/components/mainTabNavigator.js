import Profile from './profilePage';
import AddPost from './addPost';
import Home from "./homePage";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LogoutButton from './logoutButton';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="AddPost" component={AddPost} />
      <Tab.Screen name="Profile" component={Profile } options={{ headerRight: () => <LogoutButton />,  }} />
    </Tab.Navigator>
  );
}