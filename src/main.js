'use strict';

import '../css/style.css';
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

