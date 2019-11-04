import React from "react";
import {
  Button,
  StyleSheet,
  Text,
  ImageBackground,
  View,
  Alert,
  TouchableOpacity
} from "react-native";
import * as Font from "expo-font";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFontLoaded: false
    };
  }

  async componentWillMount() {
    await Font.loadAsync({
      "JosefinSans-Regular": require("../assets/fonts/JosefinSans-Regular.ttf"),
      "Raleway-Regular": require("../assets/fonts/Raleway-Regular.ttf")
    });
    this.setState({ isFontLoaded: true });
  }

  render() {
    return (
      <>
        {this.state.isFontLoaded ? (
          <View style={styles.container}>
            <ImageBackground
              source={{
                uri:
                  "https://www.transparenttextures.com/patterns/black-linen.png"
              }}
              style={{ width: "100%", height: "100%" }}
            >
              <View style={styles.titleContainer}>
                <Text style={styles.title}>O'Films</Text>
                <Text style={styles.subtitle}>Match</Text>
                <Text style={styles.intro}>
                  Bienvenue sur l'appli O'Films Match,{"\n"} où vous pouvez
                  liker ou non des films en fonction de vos goûts
                </Text>
                <TouchableOpacity
                  onPress={() => Alert.alert("Vous avez cliqué sur le bouton")}
                >
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Matcher</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        ) : (
          <View>
            <Text>Chargement en cours</Text>
          </View>
        )}
      </>
    );
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
    marginTop: 50
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
    marginTop: 50,
    textAlign: "center"
  },
  button: {
    backgroundColor: "#0CD0FC",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 50,
    height: 50,
    width: "50%"
  },
  buttonText: {
    color: "white",
    textTransform: "uppercase",
    textAlign: "center"
  }
});
