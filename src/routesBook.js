const {
  addNewBook,
  getAllBooks,
  getIdBook,
  editBook,
  deleteIdBook,
} = require('./handlerBook');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addNewBook,
  },

  {
    method: 'GET',
    path: '/books',
    handler: getAllBooks,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getIdBook,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: editBook,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteIdBook,
  },
];

module.exports = routes;
