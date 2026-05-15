import { nanoid } from 'nanoid';
import books from './books.js';

const addBookHandler = (request, response) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.body;

  if (!name) {
    return response.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
  }

  if (readPage > pageCount) {
    return response.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }

  const id = nanoid(16);

  const finished = pageCount === readPage;

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  return response.status(201).json({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
};

const getAllBooksHandler = (request, response) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = books;

  if (name) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading !== undefined) {
    const isReading = reading === '1';

    filteredBooks = filteredBooks.filter(
      (book) => book.reading === isReading,
    );
  }

  if (finished !== undefined) {
    const isFinished = finished === '1';

    filteredBooks = filteredBooks.filter(
      (book) => book.finished === isFinished,
    );
  }

  const result = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return response.status(200).json({
    status: 'success',
    data: {
      books: result,
    },
  });
};

const getBookByIdHandler = (request, response) => {
  const { bookId } = request.params;

  const book = books.find((item) => item.id === bookId);

  if (!book) {
    return response.status(404).json({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
  }

  return response.status(200).json({
    status: 'success',
    data: {
      book,
    },
  });
};

const editBookByIdHandler = (request, response) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.body;

  if (!name) {
    return response.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
  }

  if (readPage > pageCount) {
    return response.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }

  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    return response.status(404).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
  }

  const updatedAt = new Date().toISOString();

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished: pageCount === readPage,
    updatedAt,
  };

  return response.status(200).json({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
};

const deleteBookByIdHandler = (request, response) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    return response.status(404).json({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
  }

  books.splice(index, 1);

  return response.status(200).json({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
};

export {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};