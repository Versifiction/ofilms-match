import { connect } from "react-redux";

import DislikedScreen from "../screens/DislikedScreen";
import { removeFilm } from "../FilmsReducer";

const mapStateToProps = (state, ownProps) => ({
  likedFilms: state[ownProps.likedFilms],
  dislikedFilms: state[ownProps.dislikedFilms]
});

const mapDispatchToProps = dispatch => ({
  removeFilm: id => {
    console.log("dispatched");
    dispatch(removeFilm(id));
  }
});

const DislikedScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DislikedScreen);

export default DislikedScreenContainer;
