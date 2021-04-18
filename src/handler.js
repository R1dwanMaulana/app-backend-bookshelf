const {nanoid} = require('nanoid');
const books = require('./books');

// menambahkan buku
const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
    
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const hasil = (readPage === pageCount);
    
    
    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished: hasil, reading, insertedAt, updatedAt,
    };
    
    books.push(newBook);
    
    // pengecekan nama buku kosong atau tidak
    if(name === undefined || name === '') {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }
    
    
    // pengecekan halaman baca tidak boleh melebihi halaman buku
    if(readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }
    
    
    // ketika sukses kembalikan respon sukses(201)
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if(isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            }
        });
        response.code(201);
        return response;
    }
    
    // pengecekan generic error
    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
}

// mengambil semua data buku
const getAllBookHandler = (request, h) => {
    const { name } = request.query;
    
    // fitur query params(name)
    if(name) {
        const response = h.response ({
            status: 'success',
            data: {
                books: books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase())).map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }
    return h.response ({
        data: {
            books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }))
        }
    });
};

// data buku berdasarkan id
const getAllBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const book = books.filter((n) => n.id === bookId)[0];
    
    if (book !== undefined) {
        return h.response({
            status: 'success',
            data: {
                book: {
                    id: bookId,
                    name: book.name,
                    year: book.year,
                    author: book.author,
                    summary: book.summary,
                    publisher: book.publisher,
                    pageCount: book.pageCount,
                    readPage: book.readPage,
                    finished: book.finished,
                    reading: book.reading,
                    insertedAt: book.insertedAt,
                    updatedAt: book.updatedAt
                }
            }
        });
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    });
    response.code(404);
    return response;

};

// edit buku berdasarkan id
const editBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date(). toISOString();

    const index = books.findIndex((book) => book.id === bookId);
    
    if(name === undefined || name === '') {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }

    if(readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }

    if (index !== -1) {
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
            updatedAt
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }
    
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });
    response.code(404);
    return response;
    
};

// menghapus buku berdasarkan id
const deleteBookByIdHandler = (request, h) => {
    const {bookId} = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    if(index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    });
    response.code(404);
    return response;
};


module.exports = {addBookHandler, getAllBookHandler, getAllBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler};