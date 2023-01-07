export const getImageUrl = (imageName: string, extension: 'png' | 'jpg' = 'png') =>
  new URL(`../assets/images/${imageName}.${extension}`, import.meta.url).href;

export const toQuantity = (number: number) =>
  Intl.NumberFormat('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
