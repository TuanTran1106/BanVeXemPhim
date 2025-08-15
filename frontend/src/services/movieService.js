import axios from 'axios';

const API_URL = 'http://localhost:8080/api/movies';

export const getMovies = async (page = 0, size = 10) => {
    return await axios.get(`${API_URL}?page=${page}&size=${size}`);
};

export const searchMovies = async (title) => {
    return await axios.get(`${API_URL}/search?title=${title}`);
};

export const getMovieById = async (id) => {
    return await axios.get(`${API_URL}/${id}`);
};
