import React, { Component } from "react";
import axios from "axios";
import {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  View,
  TouchableOpacity,
  Picker
} from "react-native";
import { API_KEY } from "react-native-dotenv";
import * as Font from "expo-font";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categorieChosenName: "-",
      categorieChosenId: "-",
      allCategories: [],
      isFontLoaded: false,
      started: false,
      randomMovie: []
    };
    this.toggleStart = this.toggleStart.bind(this);
  }

  async componentWillMount() {
    try {
      await Font.loadAsync({
        "JosefinSans-Regular": require("../assets/fonts/JosefinSans-Regular.ttf"),
        "Raleway-Regular": require("../assets/fonts/Raleway-Regular.ttf")
      });
      this.setState({ isFontLoaded: true });
    } catch (error) {
      console.log("Font pas chargée ", error);
    }
  }

  async componentDidMount() {
    try {
      const dataMoviesGenres = await axios.get(
        "https://api.themoviedb.org/3/genre/movie/list?api_key=381e8c936f62f2ab614e9f29cad6630f&language=fr"
      );

      this.setState({
        allCategories: dataMoviesGenres.data.genres
      });
    } catch (error) {
      console.log(error);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.categorieChosenName !== prevState.categorieChosenName) {
      if (this.state.categorieChosenName !== "-") {
        this.setState({
          categorieChosenId: this.state.allCategories.find(
            c => c.name === this.state.categorieChosenName
          ).id
        });
      } else {
        this.setState({
          categorieChosenId: "-"
        });
      }
    }
  }

  async toggleStart() {
    this.setState({
      started: !this.state.started
    });

    const randomPage = Math.floor(Math.random() * 50) + 1;
    const randomIndex = Math.floor(Math.random() * 20) + 1;

    if (this.state.started) {
      try {
        const dataMoviesGenres = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=fr-FR&include_adult=false&with_genres=${categorieChosenId}&vote_average.gte=7&page=${randomPage}`
        );

        const randomMovie = dataMoviesGenres.results[randomIndex];

        this.setState({
          randomMovie: randomMovie
        });
      } catch (error) {
        console.log(error);
      }
    }

    console.log("API KEY ", API_KEY);
    console.log("randomPage ", randomPage);
    console.log("randomIndex ", randomIndex);
  }

  render() {
    const {
      allCategories,
      categorieChosenName,
      categorieChosenId,
      isFontLoaded,
      started
    } = this.state;
    if (isFontLoaded) {
      return (
        <View style={styles.container}>
          <ImageBackground
            source={{
              uri:
                "https://www.transparenttextures.com/patterns/black-linen.png"
            }}
            style={{ width: "100%", height: "100%" }}
          >
            {!started ? (
              <View style={styles.titleContainer}>
                <Text style={styles.title}>O'Films</Text>
                <Text style={styles.subtitle}>Match</Text>
                <Text style={styles.intro}>
                  Bienvenue sur l'appli O'Films Match,{"\n"} où vous pouvez
                  liker ou non des films en fonction de vos goûts.
                </Text>
                <Text style={styles.intro}>
                  Avant de commencer à matcher des films, veuillez sélectionner
                  ci-dessous au moins une catégorie.
                </Text>
                <Text style={styles.intro}>La catégorie choisie :</Text>
                <Text style={styles.chosen}>{categorieChosenName}</Text>
                <Picker
                  itemStyle={{ color: "white" }}
                  selectedValue={categorieChosenName}
                  style={{
                    height: 100,
                    width: "100%"
                  }}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ categorieChosenName: itemValue })
                  }
                >
                  <Picker.Item label="Sélectionnez une catégorie" value="-" />
                  {allCategories.map(category => (
                    <Picker.Item
                      label={category.name}
                      key={category.id}
                      value={category.name}
                    />
                  ))}
                </Picker>
                <TouchableOpacity
                  // disabled={categorieChosenName.length === 0}
                  style={styles.buttonContainer}
                  onPress={() => {
                    categorieChosenName === "-"
                      ? alert("Veuillez choisir une catégorie")
                      : this.toggleStart();
                  }}
                >
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Matcher</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View>
                  <Text style={styles.chosen}>{randomMovie.title}</Text>
                  {/* <Image
                    style={{ width: "100%", height: 400, marginTop: 50 }}
                    source={{
                      uri:
                        "https://facebook.github.io/react-native/img/tiny_logo.png"
                    }}
                  ></Image> */}
                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={this.toggleStart}
                  >
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>Arrêter</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ImageBackground>
        </View>
      );
    }
    return <Text>Chargement en cours</Text>;
  }
}

HomeScreen.navigationOptions = {
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
  }
});
