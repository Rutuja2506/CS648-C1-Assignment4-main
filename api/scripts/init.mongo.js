/* global db print */
/* eslint no-restricted-globals: "off" */
db.products.remove({});
const ProdDB = [
  {
    id: 1,
    name: 'Blue Shirt',
    category: 'Shirts',
    price: 30,
    imageURL: 'https://www.shutterstock.com/image-photo/happy-handsome-man-wear-blue-shirt-743634955',
  },

  {
    id: 2,
    name: 'Blue Denim',
    category: 'Jeans',
    price: 50,
    imageURL: 'https://www.shutterstock.com/image-photo/blue-jeans-isolated-on-white-96398333',
  },
  {
    id: 3,
    name: 'Leather Brown Belt',
    category: 'Accessories',
    price: 50,
    imageURL: 'https://www.shutterstock.com/image-photo/fastened-fashionable-mens-brown-leather-belt-1038772180',
  },


];

db.products.insertMany(ProdDB);
const count = db.products.count();
print('Inserted', count, 'products');
db.counters.remove({ _id: 'products' });
db.counters.insert({ _id: 'products', current: count });
db.products.createIndex({ id: 1 }, { unique: true });
db.products.createIndex({ name: 1 });
db.products.createIndex({ category: 1 });
db.products.createIndex({ price: 1 });
