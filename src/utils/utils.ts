export interface IProduct {
  name: string;
  price: number;
}
export const parseCsv = (csv: string | undefined ): Array<IProduct> => {
  if (csv === null || csv === undefined) return [];
  const items = csv.split('\n');
  console.log('items', items);
  return items.map(item => item.split(','))
  .filter(item => !isNaN(Number(item[1])))
    .map(item => {
    return {
      name: item[0],
      price: Number(item[1]),
    };
  });
}