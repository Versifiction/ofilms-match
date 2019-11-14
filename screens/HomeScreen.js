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

const SCREEN_HEIGHT = Dimensions.get("window").height;

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
      pending: false,
      step: "1"
    };
  }

  async componentWillMount() {
    console.log("step ", this.props.navigation.getParam("step", "1"));

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
            <View style={styles.titleContainer}>
              <Text style={styles.title}>O'Films</Text>
              <Text style={styles.subtitle}>Match</Text>
              {step === "1" && (
                <>
                  <Text style={styles.intro}>
                    Bienvenue sur l'appli O'Films Match,{"\n"} où vous pouvez
                    liker ou non des films en fonction de vos goûts.
                  </Text>

                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={() => {
                      this.setState({ step: "2" });
                    }}
                  >
                    <Icon
                      size={50}
                      name="chevron-right-circle"
                      type="material-community"
                      color="#0CD0FC"
                    />
                    {/* <View style={styles.button}>
                    <Text style={styles.buttonText}>Rechercher</Text>
                  </View> */}
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                    style={styles.secondButtonContainer}
                    onPress={() => this.props.navigation.navigate("Test")}
                  >
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>
                        Aller sur la page Test
                      </Text>
                    </View>
                  </TouchableOpacity> */}
                </>
              )}
              {step === "2" && (
                <>
                  <Text style={styles.intro}>
                    Avant de commencer à matcher des films, veuillez
                    sélectionner ci-dessous au moins une catégorie.
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
                  <View
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      marginTop: 150
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.setState({ step: "1" })}
                    >
                      <Icon
                        size={40}
                        name="chevron-left-circle"
                        type="material-community"
                        color="#0CD0FC"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        categorieChosenName === "-"
                          ? alert("Veuillez choisir une catégorie")
                          : this.props.navigation.navigate("Match", {
                              categorieChosenId: categorieChosenId
                            });
                      }}
                    >
                      <Icon
                        size={40}
                        name="chevron-right-circle"
                        type="material-community"
                        color="#0CD0FC"
                      />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
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
