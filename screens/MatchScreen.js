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
import { Icon } from "react-native-elements";
import moment from "moment";
import { bindActionCreators } from "redux";
import { addFilm } from "../FilmsActions";
import { connect } from "react-redux";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class MatchScreen extends Component {
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
          this.forceSwipe("right");
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
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
      index: 0,
      message: ""
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
    const randomIndex = Math.floor(Math.random() * 19) + 1;

    axios
      .get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=fr-FR&include_adult=false&with_genres=${this.state.categorieChosenId}&sort_by=popularity.desc&page=${randomPage}`
      )
      .then(res => {
        const randomItem = res.data.results[randomIndex];
        this.setState({
          randomMovie: randomItem,
          imageRandomMovie:
            randomItem.poster_path === null
              ? "https://via.placeholder.com/200x300/2C2F33/FFFFFF/png?text=Image+non+disponible"
              : randomItem.poster_path,
          pending: false
        });
      })
      .catch(err => console.log("err ", err));
  }

  // componentWillUpdate() {
  //   UIManager.setLayoutAnimationEnabledExperimental &&
  //     UIManager.setLayoutAnimationEnabledExperimental(true);

  //   LayoutAnimation.spring();
  // }

  forceSwipe(direction) {
    const x = direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(this.state.position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION
    }).start(() => this.onSwipeComplete(direction));
  }

  onSwipeComplete(direction) {
    const { onSwipeLeft, onSwipeRight } = this.props;

    direction === "right" ? this.onSwipeRight() : this.onSwipeLeft();
    this.state.position.setValue({ x: 0, y: 0 });
  }

  onSwipeRight() {
    this.props.addFilm(this.state.randomMovie.id, "like");
    this.setState({
      message: `${this.state.randomMovie.title} a été ajouté aux likes`
    });
    this.loadMovie();
    setTimeout(() => {
      this.setState({ message: "" });
    }, 2000);
  }

  onSwipeLeft() {
    this.props.addFilm(this.state.randomMovie.id, "dislike");
    this.setState({
      message: `${this.state.randomMovie.title} Le film a été ajouté aux dislikes`
    });
    this.loadMovie();
    setTimeout(() => {
      this.setState({ message: "" });
    }, 2000);
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
    const {
      allCategories,
      categorieChosenName,
      categorieChosenId,
      isFontLoaded,
      started,
      randomMovie,
      imageRandomMovie,
      pending,
      message
    } = this.state;
    if (pending) {
      return (
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#232D32",
            width: "100%",
            height: "100%"
          }}
        >
          <ActivityIndicator size="large" color="#0CD0FC" />
        </View>
      );
    }
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
            <Animated.View
              style={this.getCardStyle()}
              {...this.state.panResponder.panHandlers}
            >
              <Text style={styles.randomMovieTitle}>{randomMovie.title}</Text>
              <Text style={styles.randomMovieDate}>
                ({moment(randomMovie.release_date).format("YYYY")})
              </Text>
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
                onPress={() => this.loadMovie()}
                style={{ marginTop: 20 }}
              >
                <Icon
                  size={32}
                  name="autorenew"
                  type="material"
                  color="#0CD0FC"
                />
              </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("Home", { step: "1" })
              }
              style={{ marginTop: 50 }}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}>Revenir à l'accueil</Text>
              </View>
            </TouchableOpacity>

            {message !== "" && (
              <View
                style={{
                  position: "absolute",
                  bottom: 10,
                  width: "100%",
                  padding: 10,
                  backgroundColor: "green"
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center"
                  }}
                >
                  {message}
                </Text>
              </View>
            )}
          </ImageBackground>
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
    backgroundColor: "#232D32",
    width: "100%",
    height: "100%"
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
  randomMovieDate: {
    marginTop: 10,
    fontSize: 16,
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
  },
  cardStyle: {
    position: "absolute",
    backgroundColor: "#232D32",
    width: SCREEN_WIDTH
  }
});

const mapStateToProps = state => {
  const { likedFilms, dislikedFilms } = state;
  return { likedFilms, dislikedFilms };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addFilm
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(MatchScreen);
