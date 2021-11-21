import './css/styles.css';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
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
  refs.gallery.innerHTML = '';
  page=1

  if (value.trim() === '') {
     alert('Please, enter your query in the search bar!')
     return;
  };

  getPhoto(value).then(renderGallery);
  refs.btnLoadMore.removeAttribute('hidden');
  incrememtPage()
};

function renderGallery(data) {
  const markup = data.hits.map((card) => {
    return `
      <div class="photo-card overflow-hidden">
        <a class="photo-link" href="${card.largeImageURL}">
          <img class="gallery__image" src="${card.webformatURL}" alt="${card.tags}" loading="lazy" width="300" height="220"/>
          </a>
        <div class="info">
          <p class="info-item">
            <i class="material-icons">favorite</i> <span>${card.likes}</span>
          </p>
          <p class="info-item">
            <i class="material-icons">remove_red_eye</i> ${card.views}
          </p>
          <p class="info-item">
            <i class="material-icons">forum</i> ${card.comments}
          </p>
          <p class="info-item">
            <i class="material-icons">save_alt</i> ${card.downloads}
          </p>
        </div>
      </div>`;    
    })
    .join("");
  
    if (data.total > 0) { Notify.success(`"Hooray! We found ${totalHits} images."`) };

    if (data.total === 0) {
      refs.btnLoadMore.setAttribute("hidden", true)
      return Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }

  refs.gallery.insertAdjacentHTML('beforeend', markup);
  let gallery = new SimpleLightbox('.gallery a',  { captionData: 'class="info"', captionDelay: '250 ms' });
          gallery.refresh();
}

function onLoadMore (e) {
  const value = refs.form.elements.searchQuery.value;
  getPhoto(value).then(renderGallery);
   incrememtPage()  
    
    if (page > totalPages) {
     refs.btnLoadMore.classList.add('is-hidden');
     Notify.info("We're sorry, but you've reached the end of search results.");
    }
 
};

function incrememtPage() {
   page += 1;
}

