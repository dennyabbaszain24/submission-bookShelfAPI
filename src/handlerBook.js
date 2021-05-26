const { nanoid } = require('nanoid');
const books = require('./books');

//====================TODO 1 -----function add new data book-----

const addNewBook = (request, h) => {
  const {
    name,
    publisher,
    year,
    author,
    summary,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(12);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  //  jika user tidak mengisi nama buku
  if (!name) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    res.code(400);
    return res;
  }

  // jika readPage melebihi jumlah pageCount
  if (readPage > pageCount) {
    const res = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    res.code(400);
    return res;
  }

  const finished = pageCount === readPage;
  // buku baru yang akan dimasukkan ke server
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id > 0);

  if (isSuccess) {
    const res = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    res.code(201);
    return res;
  }

  const res = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
    data: {
      books,
    },
  });
  res.code(500);
  return res;
};

// =================TODO 2-----function get all databook-----
const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query;
  // checked jika user tidak menginputkan query---
  if (!reading && !name && !finished) {
    const res = h.response({
      status: 'success',
      data: {
        books: books.map((b) => ({
          id: b.id,
          name: b.name,
          publisher: b.publisher,
        })),
      },
    });

    res.code(200);
    return res;
  }
  // checked jika user menginputkan query user---
  if (name) {
    const filteredBookBySearch = books.filter((b) => {
      const regexp = new RegExp(name, 'gi');
      return regexp.test(b.name);
    });

    const res = h.response({
      status: 'success',
      data: {
        books: filteredBookBySearch.map((b) => ({
          id: b.id,
          name: b.name,
          publisher: b.publisher,
        })),
      },
    });
    res.code(200);
    return res;
  }
  // checked jika user menginputkan query reading---
  if (reading) {
    const filterBookByRead = books.filter(
      (b) => Number(b.reading) === Number(reading)
    );
    const res = h.response({
      status: 'success',
      data: {
        books: filterBookByRead.map((b) => ({
          id: b.id,
          name: b.name,
          publisher: b.publisher,
        })),
      },
    });
    res.code(200);
    return res;
  }
  // checked jika user menginputkan query finished
  if (finished) {
    const filteredBooksFinished = books.filter(
      (b) => Number(b.finished) === Number(finished)
    );
    console.log(Number(finished));
    console.log(filteredBooksFinished);
    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooksFinished.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
};

// ==================TODO 3-----function get id databook-----
const getIdBook = (request, h) => {
  const { id } = request.params;
  const booku = books.filter((b) => b.id === id)[0];
  if (booku !== undefined) {
    return h.response({
      status: 'success',
      data: {
        book: booku,
      },
    });
  }
  const res = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  res.code(404);
  return res;
};

// =================TODO 4----- function edit databook-----

const editBook = (request, h) => {
  const { id } = request.params;
  // const books = dataBook.filter((book) => book.id === id)[0];
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((index) => index.id === id);
  if (index != -1) {
    //  jika user tidak mengisi nama buku
    if (!name) {
      const res = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      res.code(400);
      return res;
    }

    // jika readPage melebihi jumlah pageCount
    if (readPage > pageCount) {
      const res = h.response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      res.code(400);
      return res;
    }
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      reading,
      readPage,
      updatedAt,
    };

    const res = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    res.code(200);
    return res;
  }
  const res = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  res.code(404);
  return res;
};

// =======================TODO 5---- function delete databook-----

const deleteIdBook = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((index) => index.id === id);
  if (index != -1) {
    books.splice(index, 1);
    const res = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    res.code(200);
    return res;
  }
  const res = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  res.code(404);
  return res;
};

module.exports = { addNewBook, getAllBooks, getIdBook, editBook, deleteIdBook };
