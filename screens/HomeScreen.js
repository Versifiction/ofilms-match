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
  ActivityIndicator
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
      randomMovie: [],
      imageRandomMovie: "",
      pending: false
    };
    this.start = this.start.bind(this);
  }

  async componentWillMount() {
    await Promise.all([
      await Font.loadAsync({
        "JosefinSans-Regular": require("../assets/fonts/JosefinSans-Regular.ttf"),
        "Raleway-Regular": require("../assets/fonts/Raleway-Regular.ttf")
      })
    ]);
    this.setState({ isFontLoaded: true });
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

    // this.animateLeft();
    // this.animateRight();
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

  // animateLeft() {
  //   this.animatedValueLeft.setValue(0);
  //   Animated.timing(this.animatedValueLeft, {
  //     toValue: 1,
  //     duration: 2000,
  //     easing: Easing.linear
  //   }).start(() => this.animateLeft());
  // }

  // animateRight() {
  //   this.animatedValueRight.setValue(0);
  //   Animated.timing(this.animatedValueRight, {
  //     toValue: 1,
  //     duration: 2000,
  //     easing: Easing.linear
  //   }).start(() => this.animateRight());
  // }

  start() {
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
        // console.log("imageRandomMovie ", this.state.imageRandomMovie);
        // console.log("randomitem poster ", randomItem.poster_path);
      })
      .catch(err => console.log("err ", err));

    // console.log("API KEY ", API_KEY);
    // console.log("randomPage ", randomPage);
    // console.log("randomIndex ", randomIndex);
  }

  render() {
    const {
      allCategories,
      categorieChosenName,
      categorieChosenId,
      isFontLoaded
    } = this.state;
    if (isFontLoaded) {
      return (
        <View style={styles.container}>
          <ScrollView>
            <ImageBackground
              source={{
                uri:
                  "https://www.transparenttextures.com/patterns/black-linen.png"
              }}
              style={{ width: "100%" }}
            >
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
                  style={styles.buttonContainer}
                  onPress={() => {
                    categorieChosenName === "-"
                      ? alert("Veuillez choisir une catégorie")
                      : this.props.navigation.navigate("Match", {
                          categorieChosenId: categorieChosenId
                        });
                  }}
                >
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Rechercher</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.secondButtonContainer}
                  onPress={() => this.props.navigation.navigate("Test")}
                >
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>
                      Aller sur la page Test
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </ScrollView>
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
