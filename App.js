import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import React, { useState, Component } from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import filmsReducer from "./FilmsReducer";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppNavigator from "./navigation/AppNavigator";

const store = createStore(filmsReducer);

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoadingComplete: false
    };

    this.loadResourcesAsync = this.loadResourcesAsync.bind(this);
    this.handleLoadingError = this.handleLoadingError.bind(this);
    this.handleFinishLoading = this.handleFinishLoading.bind(this);
  }

  async loadResourcesAsync() {
    await Promise.all([
      Asset.loadAsync([
        require("./assets/images/robot-dev.png"),
        require("./assets/images/robot-prod.png")
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free to
        // remove this if you are not using it in your app
        "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf")
      })
    ]);
  }

  handleLoadingError(error) {
    // In this case, you might want to report the error to your error reporting
    // service, for example Sentry
    console.warn(error);
  }

  handleFinishLoading() {
    this.setState({ isLoadingComplete: true });
  }

  render() {
    return (
      <>
        {!this.state.isLoadingComplete && !this.props.skipLoadingScreen ? (
          <AppLoading
            startAsync={this.loadResourcesAsync}
            onError={this.handleLoadingError}
            onFinish={this.handleFinishLoading}
          />
        ) : (
          <Provider store={store}>
            <View style={styles.container}>
              <AppNavigator
                screenProps={{
                  likedFilms: store.getState().films.likedFilms,
                  dislikedFilms: store.getState().films.dislikedFilms
                }}
              />
            </View>
          </Provider>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
