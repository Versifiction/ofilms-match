import { ADD_FILM, REMOVE_FILM } from "./types";

export const addFilm = (filmId, category) => ({
  type: ADD_FILM,
  array: category,
  payload: filmId
});

export const removeFilm = (filmId, category) => ({
  type: REMOVE_FILM,
  array: category,
  payload: filmId
});
