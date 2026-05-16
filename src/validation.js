'use strict';

// twee constants voor zoek-validatie
const MIN_SEARCH_LENGTH = 2;
const MAX_SEARCH_LENGTH = 80;



export const validateSearch = (value) => {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return { valid: true, value: '' };
  }

  if (trimmed.length < MIN_SEARCH_LENGTH) {
    return {
      valid: false,
      value: '',
      error: `Minstens ${MIN_SEARCH_LENGTH} tekens om te zoeken.`,
    };
  }

  if (trimmed.length > MAX_SEARCH_LENGTH) {
    return {
      valid: false,
      value: '',
      error: `Maximaal ${MAX_SEARCH_LENGTH} tekens toegestaan.`,
    };
  }

  return { valid: true, value: trimmed };
};
