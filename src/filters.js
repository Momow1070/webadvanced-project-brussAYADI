'use strict';

// Gebruik van JS Array methods(filter, map, sort, includes), Template literals en set en Arrow functions en OR operator

export const applyFilters = (data, filters) => {
    let filteredData = [...data]


    // zoek filter - Gebruikt verschillende methoden van prototypes: Array.prototype.filter, String.prototype.toLowerCase enz...
    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
    filteredData = filteredData.filter(venue => {
      const nameStr = (venue.translations_nl_name || venue.translations_fr_name || '').toLowerCase();
      return nameStr.includes(searchLower);
        })
    }


    // Categorieën filter - gebruikt ook verschillende methoden van prototypes
    if (filters.category !== 'all') {
        filteredData = filteredData.filter(venue => {
      const categories = venue.visit_category_nl_multi || [];
      return categories.includes(filters.category);
    });
    }

    // Gemeente filter - Hetzelfde
    if (filters.gemeente !== 'all'){
        filteredData = filteredData.filter(venue => {
      const gemee = venue.add_municipality_nl || venue.add_municipality_fr;
      return gemee === filters.gemeente;
    });
    }

    // Sorteren
    filteredData.sort((a, b) => {
    const nameA = (a.translations_nl_name || a.translations_fr_name || '').toLowerCase();
    const nameB = (b.translations_nl_name || b.translations_fr_name || '').toLowerCase();
    
    const catA = (a.visit_category_nl_multi?.[0] || '').toLowerCase();
    const catB = (b.visit_category_nl_multi?.[0] || '').toLowerCase();

    switch (filters.sort) {
      case 'name-asc':
        return nameA.localeCompare(nameB);
      case 'name-desc':
        return nameB.localeCompare(nameA);
      case 'category-asc':
        return catA.localeCompare(catB) || nameA.localeCompare(nameB); // Secondary sort by name
      default:
        return 0;
    }
  });

return filteredData;
}



