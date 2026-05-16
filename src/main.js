'use strict';

import './css/style.css';
import { fetchVenues } from './api.js';
import { renderVenues, renderFavoritesList, populateSelect, toggleLoading } from './ui.js';
import { applyFilters, extractCategories, extractMunicipalities } from './filters.js';
import { toggleFavorite } from './favorites.js';
import { validateSearch } from './validation.js';

// DOM Element(en)

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchError = document.getElementById('searchError');
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

const showSearchError = (message) => {
  searchError.textContent = message;
  searchError.hidden = false;
  searchInput.classList.add('input-invalid');
  searchInput.setAttribute('aria-invalid', 'true');
};

const clearSearchError = () => {
  searchError.textContent = '';
  searchError.hidden = true;
  searchInput.classList.remove('input-invalid');
  searchInput.setAttribute('aria-invalid', 'false');
};

const handleSearchInput = () => {
  const cleanedVal = searchInput.value.replace(/\s{2,}/g, ' ');

  if (searchInput.value !== cleanedVal) {
    searchInput.value = cleanedVal;
  }

  const result = validateSearch(cleanedVal);

  if (!result.valid) {
    showSearchError(result.error);
    activeFilters.search = '';
    updateView();
    return;
  }

  clearSearchError();
  activeFilters.search = result.value;
  updateView();
};

const setupEventListeners = () => {
  if (!searchForm || !searchInput || !searchError) return;

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSearchInput();
  });

  searchInput.addEventListener('input', handleSearchInput);

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


