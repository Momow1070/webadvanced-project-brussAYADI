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

    municipalityFilter.addEventListener('change', (e) => {
    activeFilters.municipality = e.target.value;
    updateView();
  });

    sortSelect.addEventListener('change', (e) => {
    activeFilters.sort = e.target.value;
    updateView();
  });
  };

  
