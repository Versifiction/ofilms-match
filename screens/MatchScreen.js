import React, { Component } from "react";
import axios from "axios";
import {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  View,
  TouchableOpacity,
  Picker,
  Easing,
  ScrollView,
  ActivityIndicator,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager
} from "react-native";
import { API_KEY } from "react-native-dotenv";
import * as Font from "expo-font";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

export default class MatchScreen extends Component {
  static defaultProps = {
    onSwipeRight: () => {
      // this.refs.toast.show("Ajouté aux likes");
    },
    onSwipeLeft: () => {
      // this.refs.toast.show("Ajouté aux dislikes");
    }
  };

  constructor(props) {
    super(props);

    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          console.log("swipe right");
          this.forceSwipe("right");
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          console.log("swipe left");
          this.forceSwipe("left");
        } else {
          this.resetPosition();
        }
      }
    });

    this.position = position;
    this.toast = null;
    this.state = {
      categorieChosenId: this.props.navigation.getParam(
        "categorieChosenId",
        "-"
      ),
      isFontLoaded: false,
      randomMovie: [],
      imageRandomMovie: "",
      pending: false,
      panResponder,
      position,
      index: 0
    };
  }

  componentWillMount() {
    // await Font.loadAsync({
    //   "JosefinSans-Regular": require("../assets/fonts/JosefinSans-Regular.ttf"),
    //   "Raleway-Regular": require("../assets/fonts/Raleway-Regular.ttf")
    // });
    this.setState({ isFontLoaded: true });
  }

  async componentDidMount() {
    this.loadMovie();
  }

  loadMovie() {
    this.setState({
      pending: true
    });

    const randomPage = Math.floor(Math.random() * 30) + 1;
    const randomIndex = Math.floor(Math.random() * 20) + 1;

    axios
      .get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=fr-FR&include_adult=false&with_genres=${this.state.categorieChosenId}&sort_by=popularity.desc&page=${randomPage}`
      )
      .then(res => {
        const randomItem = res.data.results[randomIndex];
        this.setState({
          randomMovie: randomItem,
          imageRandomMovie: randomItem.poster_path,
          pending: false
        });
      })
      .catch(err => console.log("err ", err));
  }

  render() {
    const {
      allCategories,
      categorieChosenName,
      categorieChosenId,
      isFontLoaded,
      started,
      randomMovie,
      imageRandomMovie,
      pending
    } = this.state;
    if (isFontLoaded) {
      return (
        <View style={styles.container}>
          <ScrollView>
            <Text style={styles.randomMovieTitle}>{randomMovie.title}</Text>
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image
                style={{ width: 200, height: 300, marginTop: 30 }}
                source={{
                  uri: `http://image.tmdb.org/t/p/w200${imageRandomMovie}`
                }}
              ></Image>
            </View>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => this.props.navigation.navigate("Home")}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}>Revenir à l'accueil </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => this.props.navigation.navigate("Home")}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}>Revenir à l'accueil </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    }
    return <Text>Chargement en cours</Text>;
  }
}

MatchScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232D32"
  },
  titleContainer: {
    marginTop: 30
  },
  title: {
    color: "#0CD0FC",
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
    alignSelf: "center"
    // fontFamily: "JosefinSans-Regular"
  },
  subtitle: {
    color: "#DC8873",
    fontSize: 22,
    alignSelf: "center"
    // fontFamily: "Raleway-Regular"
  },
  intro: {
    color: "#95878B",
    marginTop: 20,
    textAlign: "center"
  },
  chosen: {
    color: "#0CD0FC",
    textAlign: "center"
  },
  buttonContainer: {
    marginTop: 150
  },
  button: {
    backgroundColor: "#0CD0FC",
    alignSelf: "center",
    justifyContent: "center",
    height: 50,
    width: "50%"
  },
  buttonText: {
    color: "white",
    textTransform: "uppercase",
    textAlign: "center"
  },
  containerStarted: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  introStarted: {
    color: "#95878B",
    marginTop: 50,
    textAlign: "center"
  },
  randomMovieTitle: {
    marginTop: 30,
    fontWeight: "bold",
    fontSize: 20,
    textTransform: "uppercase",
    color: "#0CD0FC",
    textAlign: "center"
  },
  buttonStartedContainer: {
    marginTop: 50,
    width: 200
  },
  arrowLeft: {
    height: 40,
    width: "50%"
  },
  arrowRight: {
    height: 40,
    width: "50%"
  }
  // cardStyle: {
  //   position: "absolute",
  //   backgroundColor: "#232D32",
  //   width: SCREEN_WIDTH
  // }
});
