import './css/styles.css';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import 'material-icons/iconfont/material-icons.css';
import refs from './js/refs';
import Pixabay from './js/apiSearch';
import card from './template/card.hbs';

refs.form.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', onLoadMoreBtn);
const pix = new Pixabay();

refs.btnLoadMore.setAttribute("hidden", true)

function onSearch(e) {
  e.preventDefault();
  pix.query = e.currentTarget.elements.searchQuery.value.trim();
  refs.gallery.innerHTML = '';
  refs.form.reset();
  refs.btnLoadMore.removeAttribute("hidden", true);
  pix.resetPage();
  pix.getPhoto().then(({ hits, totalHits, perPage, page, total }) => {

    if (pix.query === '') {
      refs.btnLoadMore.setAttribute("hidden", true)
      Notify.failure(`Please, enter your query in the search bar!`);
      return;
    }
    if (total < pix.perPage) {
      refs.btnLoadMore.setAttribute("hidden", true)
    }
    
    if (total === 0) {
      refs.btnLoadMore.setAttribute("hidden", true)
      Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
      return;
    }
    
    Notify.success(`Hooray! We found ${total} images.`);
   
    renderGallery(hits);
    lightbox();
    
  })
}

function onLoadMoreBtn() {
  pix.getPhoto().then(({ hits, totalHits, perPage, page, total }) => {
      renderGallery(hits);
    lightbox();

  if (hits.length < 40){
  refs.btnLoadMore.setAttribute("hidden", true)
   Notify.info(`We're sorry, but you've reached the end of search results.`);
    return;
  }
  })
}

function renderGallery(hits) {
    refs.gallery.insertAdjacentHTML('beforeend', card(hits));
}

function lightbox() {
  const lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();
}