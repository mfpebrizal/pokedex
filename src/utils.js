import { IMAGE_URL } from './constant'

export const firstLetterCapitalize = (string) => {
    if(!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getIdTypeFromUrl = (url) => {
    if(url) {
      const split = url.match(/^https:\/\/pokeapi.co\/api\/v2\/type\/(\d+)/);
      return split[1];
    }
    return 0;
}

export const generateImageUrl = (url) => {
    if (url) {
      const split = url.match(/^https:\/\/pokeapi.co\/api\/v2\/pokemon\/(\d+)/);
      return `${IMAGE_URL}/${split[1]}.png`;
    }
    return '';
};