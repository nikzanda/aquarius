export const getImageUrl = (imageName: string, extension: 'png' | 'jpg' = 'png') =>
  new URL(`../assets/images/${imageName}.${extension}`, import.meta.url).href;
