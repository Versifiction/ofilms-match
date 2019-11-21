import { createStackNavigator, createAppContainer } from "react-navigation";
import Home from "../screens/HomeScreen";
import Match from "../screens/MatchScreen";
import Test from "../screens/TestScreen";
import Liked from "../screens/LikedScreen";
import Disliked from "../screens/DislikedScreen";

const AppNavigator = createStackNavigator({
  Home: { screen: Home },
  Match: { screen: Match },
  Test: { screen: Test },
  Liked: { screen: Liked },
  Disliked: { screen: Disliked }
});

const App = createAppContainer(AppNavigator);

export default App;
