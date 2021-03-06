const cities = require('./cities.json');
export interface IProduct {
  name: string;
  price: number;
}

/**
 * check if product csv is valid
 * @param {string} csv - csv string being validate
 */
export const validateProductCsv = (csv: string): boolean => {
  const items = csv.split('\n');
  if (items.length === 1 && !items[0]) return false;
  const products = items.filter(
    (item) => item !== '' && !item.startsWith('Product,Price'),
  );
  for (let product of products) {
    const pair = product.split(',');
    if (!pair[1]) return false;
    if (isNaN(Number(pair[1]))) return false;
  }
  return true;
};

/**
 * parse csv string to product array
 * @param {string} csv - csv string being parsed
 */

export const parseCsv = (csv: string | undefined): Array<IProduct> => {
  if (csv === null || csv === undefined || !validateProductCsv(csv)) return [];
  const items = csv.split('\n');
  return items
    .map((item) => item.split(','))
    .filter((item) => !isNaN(Number(item[1])))
    .map((item) => {
      return {
        name: item[0],
        price: Number(item[1]),
      };
    });
};

export const getCountriesAndCities = (): Array<{
  city: string;
  country: string;
}> => cities;
