// Arrow functies en try & catch block en Constants
// 

'use strict';

// Data bijhouden in localStorage met een specifiek key 
export const saveToStorage = (key, data) => {
    try {
      // Naar string converteren omdat localStorage kan alleen strings bijhouden
        const serializedData = JSON.stringify(data);
        localStorage.setItem(key, serializedData);
    }catch(error){
            console.error(`Error saving ${key} to localStorage:`, error);
    }
};

// Data krijgen van localStorage, of een defaultvalue als er nieks is
export const getFromStorage = (key, defaultValue = null) => {
    try {
    const serializedData = localStorage.getItem(key);
    // Als er geen key gevonden is, zal onze fallbackvalue(null) gereturned worden
    if (serializedData === null) {
      return defaultValue;
    }
    // Text terug als JS value converteren
    return JSON.parse(serializedData);
    } catch (error) {
      //
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
};