import { createStackNavigator, createAppContainer } from "react-navigation";
import Home from "../screens/HomeScreen";
import Match from "../screens/MatchScreen";
import Test from "../screens/TestScreen";

const AppNavigator = createStackNavigator({
  Home: { screen: Home },
  Match: { screen: Match },
  Test: { screen: Test }
});

const App = createAppContainer(AppNavigator);

export default App;
