import './css/styles.css';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import 'material-icons/iconfont/material-icons.css';
import refs from './js/refs';
import { getPhoto } from './js/apiSearch'


let page = 1;
const pageSize = 40;

refs.btnLoadMore.setAttribute("hidden", true)

refs.form.addEventListener('submit', onSearch)
refs.btnLoadMore.addEventListener('click', onLoadMore)
 
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
  const markup = data.hits.map(({largeImageURL, webformatURL, tags, likes, views, comments, downloads}) => {
    return `
      <div class="photo-card overflow-hidden">
        <a class="photo-link" href="${largeImageURL}">
          <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" width="300" height="220"/>
          </a>
        <div class="info">
          <p class="info-item">
            <i class="material-icons">favorite</i> <span>${likes}</span>
          </p>
          <p class="info-item">
            <i class="material-icons">remove_red_eye</i> ${views}
          </p>
          <p class="info-item">
            <i class="material-icons">forum</i> ${comments}
          </p>
          <p class="info-item">
            <i class="material-icons">save_alt</i> ${downloads}
          </p>
        </div>
      </div>`;    
    })
    .join("");
  
  console.log(data.total)
  if (data.total > 0) {
    Notify.success(`"Hooray! We found ${data.total} images."`)
  };

  if (data.total < 40) { refs.btnLoadMore.setAttribute("hidden", true) }

  if (data.total === 0) {
    refs.btnLoadMore.setAttribute("hidden", true)
      return Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  }
  const lastPage = Math.ceil(data.total / pageSize);
    if (page === lastPage +1 ) {
refs.btnLoadMore.setAttribute("hidden", true)
     Notify.info("We're sorry, but you've reached the end of search results.");
    }  
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  let gallery = new SimpleLightbox('.gallery a',  { captionData: 'class="info"', captionDelay: '250 ms' });
          gallery.refresh();
}

function onLoadMore (e) {
  const value = refs.form.elements.searchQuery.value;
  getPhoto(value).then(renderGallery);
  incrememtPage()
};

function incrememtPage() {
  page += 1;
}