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
  Dimensions
} from "react-native";
import { API_KEY } from "react-native-dotenv";
import * as Font from "expo-font";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";

import Nav from "../components/Nav";

class DislikedScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFontLoaded: false,
      moviesDislikedDetails: []
    };
  }

  componentDidMount() {
    this.loadMoviesDislikedDetails();
    console.log("liked films ", this.props.dislikedFilms);
  }

  async componentWillMount() {
    await Promise.all([
      Font.loadAsync({
        "JosefinSans-Regular": require("../assets/fonts/JosefinSans-Regular.ttf"),
        "Raleway-Regular": require("../assets/fonts/Raleway-Regular.ttf")
      })
    ]);
    this.setState({ isFontLoaded: true });
  }

  async loadMoviesDislikedDetails() {
    this.props.dislikedFilms.forEach(async movie => {
      try {
        const dataDetail = await axios.get(
          `https://api.themoviedb.org/3/movie/${movie}?api_key=${API_KEY}&language=fr`
        );

        this.setState({
          moviesDislikedDetails: [
            ...this.state.moviesDislikedDetails,
            dataDetail.data
          ]
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  render() {
    const {
      allCategories,
      categorieChosenName,
      categorieChosenId,
      isFontLoaded,
      step
    } = this.state;

    if (isFontLoaded) {
      return (
        <View style={styles.container}>
          <ImageBackground
            source={{
              uri:
                "https://www.transparenttextures.com/patterns/black-linen.png"
            }}
            style={{
              width: "100%",
              height: "100%"
            }}
          >
            <Nav />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>O'Films</Text>
              <Text style={styles.subtitle}>Match</Text>
              <Text style={styles.intro}>Dislikés</Text>
            </View>
            <View
              style={{
                flex: "1",
                flexDirection: "row",
                flexWrap: "wrap",
                marginTop: 20
              }}
            >
              {this.state.moviesDislikedDetails.map((movie, index) => (
                <Image
                  style={{
                    width: "33%",
                    height: 150,
                    padding: 4
                  }}
                  key={movie.id}
                  source={{
                    uri: `http://image.tmdb.org/t/p/w200${this.state.moviesDislikedDetails[index].poster_path}`
                  }}
                ></Image>
              ))}
            </View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Home")}
              style={{ marginTop: 50 }}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}>Revenir à l'accueil</Text>
              </View>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      );
    }
    return <Text>Chargement en cours</Text>;
  }
}

DislikedScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232D32",
    padding: 4
  },
  titleContainer: {
    marginTop: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    color: "#0CD0FC",
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
    alignSelf: "center",
    fontFamily: "JosefinSans-Regular"
  },
  subtitle: {
    color: "#DC8873",
    fontSize: 22,
    alignSelf: "center",
    fontFamily: "Raleway-Regular"
  },
  intro: {
    color: "white",
    marginTop: 20,
    fontSize: 24,
    textAlign: "center",
    textTransform: "uppercase"
  },
  chosen: {
    color: "#0CD0FC",
    textAlign: "center"
  },
  buttonContainer: {
    marginTop: 30
  },
  secondButtonContainer: {
    marginTop: 10
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
    marginTop: 25,
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

const mapStateToProps = state => ({
  dislikedFilms: state.films.dislikedFilms
});
export default connect(mapStateToProps)(DislikedScreen);
