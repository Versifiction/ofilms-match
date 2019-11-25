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
  Dimensions,
  Alert
} from "react-native";
import { API_KEY } from "react-native-dotenv";
import * as Font from "expo-font";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { removeFilm } from "../FilmsActions";

import Nav from "../components/Nav";

class LikedScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFontLoaded: false,
      moviesLikedDetails: []
    };
  }

  componentDidMount() {
    this.loadMoviesLikedDetails();
    console.log("liked films ", this.props.likedFilms);
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

  async loadMoviesLikedDetails() {
    this.setState({
      moviesLikedDetails: []
    });

    this.props.likedFilms.forEach(async movie => {
      try {
        const dataDetail = await axios.get(
          `https://api.themoviedb.org/3/movie/${movie}?api_key=${API_KEY}&language=fr`
        );

        this.setState({
          moviesLikedDetails: [
            ...this.state.moviesLikedDetails,
            dataDetail.data
          ]
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  showModal(title, id) {
    Alert.alert(
      "Suppresion",
      `Voulez-vous supprimer ${title} de vos likes ?`,
      [
        {
          text: "Valider",
          onPress: () => {
            this.props.removeFilm(id, "like");
            this.loadMoviesLikedDetails();
          }
        },
        {
          text: "Annuler",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
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
              <Text style={styles.intro}>Likés</Text>
            </View>
            <View
              style={{
                flex: "1",
                flexDirection: "row",
                flexWrap: "wrap",
                marginTop: 20
              }}
            >
              {this.state.moviesLikedDetails.map((movie, index) => (
                <TouchableOpacity
                  key={movie.id}
                  onLongPress={() =>
                    this.showModal(
                      this.state.moviesLikedDetails[index].title,
                      this.state.moviesLikedDetails[index].id
                    )
                  }
                  style={{
                    width: "33%",
                    height: 150,
                    padding: 4
                  }}
                >
                  <Image
                    style={{
                      width: "100%",
                      height: "100%"
                    }}
                    source={{
                      uri: `http://image.tmdb.org/t/p/w200${this.state.moviesLikedDetails[index].poster_path}`
                    }}
                  ></Image>
                </TouchableOpacity>
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

LikedScreen.navigationOptions = {
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
  likedFilms: state.films.likedFilms
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      removeFilm
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(LikedScreen);
