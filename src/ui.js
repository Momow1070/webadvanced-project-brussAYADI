'use strict';

import { isFavorite, getFavorites } from './favorites.js';

const elements = {
  venueList: document.getElementById('venueList'),
  favoritesList: document.getElementById('favoritesList'),
  resultsInfo: document.getElementById('resultsInfo'),
  categoryFilter: document.getElementById('categoryFilter'),
  gemeenteFilter: document.getElementById('gemeenteFilter'),
  loadingIndicator: document.getElementById('loadingIndicator'),
};

export const renderVenues = (venues, onFavoriteClick) => {
  if (!elements.venueList) return;
  elements.venueList.innerHTML = '';
  
  // Als er geen resultaten gevonden zijn, nieks returnen
  if (venues.length === 0) {
    elements.venueList.innerHTML = '<p class="empty-favorites">Geen resultaten gevonden voor deze zoekopdracht.</p>';
    elements.resultsInfo.textContent = '0 resultaten gevonden';
    return;
  }

  // Of anders
  elements.resultsInfo.textContent = `${venues.length} resultaten gevonden`;

  const cardsHtml = venues.map(venue => {
    const name = venue.translations_nl_name || venue.translations_fr_name || 'Onbekende Naam';
    const category = venue.visit_category_nl_multi?.[0] || 'Overige';
    const gemeente = venue.add_municipality_nl || venue.add_municipality_fr || 'Onbekend';
    const address = venue.translations_nl_address_line1 || venue.translations_fr_address_line1 || 'Geen adres';
    const website = venue.translations_fr_website || venue.translations_nl_website || '#';
    const hasWebsite = website !== '#';
    const mapLink = venue.google_maps || '#';
    const hasMap = mapLink !== '#';
    const isFav = isFavorite(venue.id);

    // template literals 
    return `
      <article class="venue-card glass-panel" data-id="${venue.id}">
        <div class="card-header">
          <div class="card-category">${category}</div>
          <h3 class="card-title">${name}</h3>
        </div>
        <div class="card-body">
          <div class="detail-row">
            <span class="detail-icon">📍</span>
            <span>${address}, ${gemeente}</span>
          </div>
        </div>
        <div class="card-footer">
          <div class="card-actions">
            ${hasWebsite ? `<a href="${website}" target="_blank" class="btn btn-primary">Website</a>` : ''}
            ${hasMap ? `<a href="${mapLink}" target="_blank" class="btn btn-primary" style="background-color: var(--accent-color);">Map</a>` : ''}
          </div>
          <button class="btn-favorite ${isFav ? 'active' : ''}" aria-label="Toevoegen aan favorieten" data-id="${venue.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
        </div>
      </article>
    `;
  }).join('');

  elements.venueList.innerHTML = cardsHtml;


  const favButtons = elements.venueList.querySelectorAll('.btn-favorite');
  favButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      const venue = venues.find(v => v.id === id);
      if (venue && onFavoriteClick) {
        const isNowFav = onFavoriteClick(venue);
        // Toggle UI
        btn.classList.toggle('active', isNowFav);
        const svg = btn.querySelector('svg');
        if (isNowFav) {
          svg.setAttribute('fill', 'currentColor');
        } else {
          svg.setAttribute('fill', 'none');
        }
      }
    });
  });
};


// Favorieten lijst in sidebar renderen

export const renderFavoritesList = (onRemoveClick) => {
  if (!elements.favoritesList) return;

  const favorites = getFavorites();
  
  if (favorites.length === 0) {
    elements.favoritesList.innerHTML = '<p class="empty-favorites">Je hebt nog geen favorieten toegevoegd.</p>';
    return;
  }

  const listHtml = favorites.map(fav => `
    <div class="favorite-item">
      <div class="favorite-info">
        <div class="favorite-name" title="${fav.name}">${fav.name}</div>
        <div class="favorite-cat">${fav.category}</div>
      </div>
      <button class="btn-remove" aria-label="Verwijder favoriet" data-id="${fav.id}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
  `).join('');

  elements.favoritesList.innerHTML = listHtml;

  const removeButtons = elements.favoritesList.querySelectorAll('.btn-remove');
  removeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (onRemoveClick) {
        onRemoveClick(id);
      }
    });
  });
};
