import axios from 'axios';


axios.defaults.baseURL = 'https://pixabay.com/api';
const API_KEY = '?key=24424361-80a045fa2441dce42755517a4'
let page = 1;
const pageSize = 40;

export async function getPhoto (value) {
  try {
    const url = `${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${pageSize}`;
    const response = await axios.get(url);
  return response.data;
  } catch (error) {
    console.error(error);
  }
  console.log(response.data)
};
 