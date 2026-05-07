'use strict';
import { saveToStorage, getFromStorage } from './storage.js';

const FAVORITES_KEY = 'bru_culture_favorites';
let favorites = getFromStorage(FAVORITES_KEY, []);

export const getFavorites = () => favorites;

export const isFavorite = (id) => favorites.some(fav => fav.id === id);

export const toggleFavorite = (venue) => {
    if (isFavorite(venue.id)) {
    favorites = favorites.filter(fav => fav.id !== venue.id);
  } else {
    // storage klein houden door alleen necessary data bijhouden
    favorites.push({
      id: venue.id,
      // Gebruik van OR operator 
      name: venue.translations_nl_name || venue.translations_fr_name || 'Onbekend',
      category: venue.visit_category_nl_multi?.[0] || 'Overige'
    });
  }
saveToStorage(FAVORITES_KEY, favorites);
return isFavorite(venue.id);
};