const { nanoid } = require("nanoid")
const books = require("./books")

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  if (!name) {
    return h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku"
    }).code(400)
  }

  if (readPage > pageCount) {
    return h.response({
      status: "fail",
      message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
    }).code(400)
  }

  const id = nanoid(16)
  const finished = false
  const createdAt = new Date().toISOString()
  const updatedAt = createdAt

  const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, createdAt, updatedAt }
  books.push(newBook)

  const isSuccess = books.filter(book => book.id === id).length > 0
  if (!isSuccess) {
    return h.response({
      status: "fail",
      message: "Gagal menambahkan buku"
    }).code(500)
  }

  return h.response({
    status: "success",
    message: "Buku berhasil ditambahkan",
    data: { bookId: id }
  }).code(200)
}

const getAllBooksHandler = (request, h) => {
  return h.response({
    status: "success",
    data: { books }
  }).code(200)
}

const getBookByIdHandler = (request, h) => {
  const { id } = request.params

  const book = books.filter(book => book.id === id)[0]
  if (!book) {
    return h.response({
      status: "fail",
      message: "Buku tidak ditemukan"
    }).code(404)
  }

  return h.response({
    status: "success",
    data: { book }
  }).code(200)
}

const updateBookByIdHandler = (request, h) => {
  const { id } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  if (!name) {
    return h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku"
    }).code(400)
  }

  if (readPage > pageCount) {
    return h.response({
      status: "fail",
      message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
    }).code(400)
  }

  const updatedAt = new Date().toISOString()
  const bookIndex = books.findIndex(book => book.id === id)
  if (bookIndex < -1) {
    return h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan"
    }).code(404)
  }

  books[bookIndex] = { ...bookIndex[bookIndex], name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt }

  return h.response({
    status: "success",
    message: "Buku berhasil diperbarui"
  }).code(200)
}

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params

  const bookIndex = books.findIndex(book => book.id === id)
  if (bookIndex < -1) {
    return h.response({
      status: "failed",
      message: "Buku gagal dihapus. Id tidak ditemukan"
    }).code(404)
  }

  books.splice(bookIndex, 1)
  return h.response({
    status: "success",
    message: "Buku berhasil dihapus"
  }).code(200)
}

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, updateBookByIdHandler, deleteBookByIdHandler }