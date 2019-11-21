import React, { Component } from "react";
import NavBar, { NavButton, NavButtonText, NavTitle } from "react-native-nav";
import { StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: "#000"
  },
  navBar: {
    backgroundColor: "#212121"
  },
  title: {
    color: "#fff"
  },
  buttonText: {
    color: "#0CD0FC",
    textTransform: "uppercase",
    fontWeight: "bold"
  }
});

class Nav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <NavBar style={styles} statusBar={{ barStyle: "light-content" }}>
        <NavButton onPress={() => this.props.navigation.navigate("Disliked")}>
          <NavButtonText style={styles.buttonText}>Dislikés</NavButtonText>
        </NavButton>
        <NavButton onPress={() => this.props.navigation.navigate("Liked")}>
          <NavButtonText style={styles.buttonText}>Likés</NavButtonText>
        </NavButton>
      </NavBar>
    );
  }
}

export default withNavigation(Nav);
