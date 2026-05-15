'use strict';

import './css/style.css';
import { fetchVenues } from './api.js';
import { renderVenues, renderFavoritesList, populateSelect, toggleLoading } from './ui.js';
import { applyFilters, extractCategories, extractMunicipalities } from './filters.js';
import { toggleFavorite, isFavorite } from './favorites.js';
import { saveToStorage, getFromStorage } from './storage.js';

// DOm Element(en)

const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const gemeenteFilter = document.getElementById('gemeenteFilter');
const sortSelect = document.getElementById('sortSelect');

let allVenues = [];
const activeFilters = {
  search: '',
  category: 'all',
  gemeente: 'all',
  sort: 'name-asc',
};

// UI updaten op basis van huidige staat 
const updateView = () => {
  const filteredData = applyFilters(allVenues, activeFilters);
  renderVenues(filteredData, handleFavoriteClick);
  renderFavoritesList(handleRemoveFavoriteClick);
};

// "Favoriet" in kaarten laten werken 

const handleFavoriteClick = (venue) => {
  const isNowfav = toggleFavorite(venue);
  renderFavoritesList(handleRemoveFavoriteClick);
  return isNowfav;
};

const handleRemoveFavoriteClick = (id) => {
  toggleFavorite({ id });
  updateView();
};

const setupEventListeners = () => {

  searchInput.addEventListener('input', (e) => {
    const val = e.target.value;
    const cleanedVal = val.replace(/\s{2,}/g, ' ');

    if (val !== cleanedVal) {
      searchInput.value = cleanedVal;
    }

    activeFilters.search = cleanedVal;
    updateView();
  });

  categoryFilter.addEventListener('change', (e) => {
    activeFilters.category = e.target.value;
    updateView();
  });

  gemeenteFilter.addEventListener('change', (e) => {
    activeFilters.gemeente = e.target.value;
    updateView();
  });

  sortSelect.addEventListener('change', (e) => {
    activeFilters.sort = e.target.value;
    updateView();
  });
};


// Initalisatie van app
const init = async () => {
  setupEventListeners();
  toggleLoading(true);

  // fetchen van data
  allVenues = await fetchVenues();

  toggleLoading(false);

  if (allVenues.length > 0) {
    // filters dropdown vullen met data
    const categories = extractCategories(allVenues);
    const municipalities = extractMunicipalities(allVenues);

    populateSelect('categoryFilter', categories, 'Alle categorieën');
    populateSelect('gemeenteFilter', municipalities, 'Alle gemeenten');

    // initiele render
    updateView();
  } else {
    document.getElementById('venueList').innerHTML = '<p class="empty-favorites" style="color: var(--danger-color);">Kon geen data ophalen van de API. Controleer je netwerkverbinding.</p>';
  }
};

// Applicatie zal alleen starten wanneer DOM ready is
document.addEventListener('DOMContentLoaded', init);


