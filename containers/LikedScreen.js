import { connect } from "react-redux";

import LikedScreen from "../screens/LikedScreen";
import { removeFilm } from "../FilmsReducer";

// const mapStateToProps = (state, ownProps) => ({
//   likedFilms: state[ownProps.likedFilms]
// });

const mapStateToProps = state => ({
  likedFilms: state.likedFilms
});

const mapDispatchToProps = dispatch => ({
  removeFilm: id => {
    console.log("dispatched");
    dispatch(removeFilm(id));
  }
});

const LikedScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LikedScreen);

export default LikedScreenContainer;
