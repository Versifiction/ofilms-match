import { combineReducers } from "redux";
import { ADD_FILM, REMOVE_FILM } from "./types";

const initialState = {
  name: "",
  likedFilms: [299534, 49530, 629],
  dislikedFilms: [100241, 559969, 429617]
};

const filmsReducer = (state = initialState, action) => {
  const { likedFilms, dislikedFilms } = state;
  switch (action.type) {
    case ADD_FILM:
      if (action.array === "like") {
        const newLikedFilms = [...state.likedFilms, action.payload];

        return {
          ...state,
          likedFilms: newLikedFilms
        };
      } else {
        const newDislikedFilms = [...state.dislikedFilms, action.payload];

        return {
          ...state,
          dislikedFilms: newDislikedFilms
        };
      }

    case REMOVE_FILM:
      action.array === "like"
        ? likedFilms.splice(dislikedFilms.indexOf(action.payload), 1)
        : dislikedFilms.splice(dislikedFilms.indexOf(action.payload), 1);

      return {
        ...state,
        likedFilms,
        dislikedFilms
      };

    default:
      return state;
  }
};

export default combineReducers({
  films: filmsReducer
});
