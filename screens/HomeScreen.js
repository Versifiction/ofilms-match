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
// import {  AppLoading } from "expo";
import * as Font from "expo-font";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categorieChosen: "-",
      allCategories: [],
      isFontLoaded: false,
      started: false
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

  toggleStart() {
    this.setState({
      started: !this.state.started
    });
  }

  render() {
    const {
      allCategories,
      categorieChosen,
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
                <Text style={styles.chosen}>{categorieChosen}</Text>
                <Picker
                  itemStyle={{ color: "white" }}
                  selectedValue={categorieChosen}
                  style={{
                    height: 100,
                    width: "100%"
                  }}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ categorieChosen: itemValue })
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
                  // disabled={categorieChosen.length === 0}
                  style={styles.buttonContainer}
                  onPress={() => {
                    categorieChosen.length === 0
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
                  <Image
                    style={{ width: "100%", height: 400, marginTop: 50 }}
                    source={{
                      uri:
                        "https://facebook.github.io/react-native/img/tiny_logo.png"
                    }}
                  ></Image>
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
