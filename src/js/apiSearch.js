import axios from 'axios';


axios.defaults.baseURL = 'https://pixabay.com/api';
const API_KEY = '?key=24424361-80a045fa2441dce42755517a4'

export default class Pixabay {
    constructor() {
        this.searchQuery = "";
        this.page = 1;
        this.perPage = 40;
        this.totalHits = 0;
        this.total = 0;
        
    }
    async getPhoto() {
        try {
            const url = `${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`;
            const hits = await axios.get(url);
            this.incrementPage();
            return hits.data;
        } catch (error) {
        }
    };

    incrementPage() {
        this.page +=1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}