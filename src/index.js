import './css/styles.css';
import { Notify } from 'notiflix';
import axios from 'axios';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
  input: document.querySelector('input'),
}

axios.defaults.baseURL = 'https://pixabay.com/api';
const API_KEY = '?key=24424361-80a045fa2441dce42755517a4'
let page = 1;
let totalHits = 500;
const pageSize = 40;
const totalPages = totalHits / pageSize;

refs.btnLoadMore.setAttribute("hidden", true)

refs.form.addEventListener('submit', onSearch)
refs.btnLoadMore.addEventListener('click', onLoadMore)

async function getPhoto (value) {
  try {
    const url = `${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${pageSize}`;
    const response = await axios.get(url);
  return response.data;
  } catch (error) {
    console.error(error);
  }    
};
  
function onSearch (e) {
  const value = refs.form.elements.searchQuery.value;
  e.preventDefault();
  if (value.trim() === '') {
     alert('Please, enter your query in the search bar!')
     return;
  };
  Notify.info(`"Hooray! We found ${totalHits} images."`);

  getPhoto(value).then(renderGallery);
    refs.btnLoadMore.removeAttribute('hidden');
;
  };
     
function renderGallery(data) {
  const markup = data.hits.map((card) => {
    return `<div class="photo-card">
    <img src="${card.webformatURL}" alt="${card.tags}" loading="lazy" width="300" height="220"/>
    <div class="info">
      <p class="info-item">
        <b>Likes: ${card.likes}</b>
      </p>
      <p class="info-item">
        <b>Views: ${card.views}</b>
      </p>
      <p class="info-item">
        <b>Comments: ${card.comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads: ${card.downloads}</b>
      </p>
    </div>
  </div>`;    
})
    .join("");
  
    if (data.total === 0) {
      refs.btnLoadMore.classList.add('is-hidden');
      return Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    } 
return refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function onLoadMore (e) {
  const value = refs.form.elements.searchQuery.value;
    getPhoto(value).then(renderGallery);
    page += 1;
    
    if (page > totalPages) {
     refs.btnLoadMore.classList.add('is-hidden');
     Notify.info("We're sorry, but you've reached the end of search results.");
    }
};

