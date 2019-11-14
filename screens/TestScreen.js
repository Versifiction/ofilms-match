import React, { Component } from "react";
import axios from "axios";
import {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  View,
  TouchableOpacity,
  ScrollView,
  Button,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager
} from "react-native";
import Deck from "../components/Deck";

const DATA = [
  {
    id: 1,
    text: "Card #1",
    uri: "http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-04.jpg"
  },
  {
    id: 2,
    text: "Card #2",
    uri: "http://www.fluxdigital.co/wp-content/uploads/2015/04/Unsplash.jpg"
  },
  {
    id: 3,
    text: "Card #3",
    uri: "http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-09.jpg"
  },
  {
    id: 4,
    text: "Card #4",
    uri: "http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-01.jpg"
  },
  {
    id: 5,
    text: "Card #5",
    uri: "http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-04.jpg"
  },
  {
    id: 6,
    text: "Card #6",
    uri: "http://www.fluxdigital.co/wp-content/uploads/2015/04/Unsplash.jpg"
  },
  {
    id: 7,
    text: "Card #7",
    uri: "http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-09.jpg"
  },
  {
    id: 8,
    text: "Card #8",
    uri: "http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-01.jpg"
  }
];

export default class TestScreen extends Component {
  renderCard(item) {
    return (
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text style={styles.randomMovieTitle}>{item.text}</Text>
        <Image
          source={{ uri: item.uri }}
          style={{ width: 400, height: 300, marginTop: 30 }}
        ></Image>
      </View>
    );
  }

  componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);

    LayoutAnimation.spring();
  }

  forceSwipe(direction) {
    const x = direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(this.state.position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION
    }).start(() => this.onSwipeComplete(direction));
  }

  onSwipeComplete(direction) {
    const { onSwipeLeft, onSwipeRight, data } = this.props;
    const item = data[this.state.index];

    direction === "right" ? onSwipeRight(item) : onSwipeLeft(item);
    this.state.position.setValue({ x: 0, y: 0 });
    this.setState({ index: this.state.index + 1 });
  }

  resetPosition() {
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  getCardStyle() {
    const { position } = this.state;

    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ["-120deg", "0deg", "120deg"]
    });
    return {
      ...position.getLayout(),
      transform: [{ rotate }]
    };
  }

  render() {
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
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Home")}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}>Revenir à l'accueil </Text>
              </View>
            </TouchableOpacity>
            <Deck
              data={DATA}
              renderCard={this.renderCard}
              renderNoMoreCards={this.renderNoMoreCards}
            />
          </ImageBackground>
        </ScrollView>
      </View>
    );
  }
}

TestScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232D32"
  },
  randomMovieTitle: {
    marginTop: 30,
    fontWeight: "bold",
    fontSize: 20,
    textTransform: "uppercase",
    color: "#0CD0FC",
    textAlign: "center"
  },
  ball: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 30,
    borderColor: "green"
  },
  intro: {
    color: "#95878B",
    marginTop: 20,
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
  }
});
