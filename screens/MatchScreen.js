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
  Animated,
  Easing,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { API_KEY } from "react-native-dotenv";
import * as Font from "expo-font";

export default class MatchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categorieChosenId: this.props.navigation.getParam(
        "categorieChosenId",
        "-"
      ),
      isFontLoaded: false,
      randomMovie: [],
      imageRandomMovie: "",
      pending: false
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
        // console.log("randomitem ", randomItem);
        console.log("imageRandomMovie ", this.state.imageRandomMovie);
        console.log("randomitem poster ", randomItem.poster_path);
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
            {/* <View
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          height: 50,
                          alignContent: "space-between"
                        }}
                      >
                        <View style={styles.arrowLeft}>
                          <Animated.View
                            style={{
                              marginRight,
                              height: "100%",
                              marginTop: 10,
                              width: 50,
                              backgroundColor: "red"
                            }}
                          />
                        </View>
                        <View style={styles.arrowRight}>
                          <Animated.View
                            style={{
                              marginLeft,
                              height: "100%",
                              marginTop: 10,
                              width: 50,
                              backgroundColor: "green"
                            }}
                          />
                        </View>
                      </View> */}
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
});
