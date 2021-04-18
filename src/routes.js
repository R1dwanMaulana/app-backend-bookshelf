const { addBookHandler, getAllBookHandler, getAllBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler } = require("./handler");

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBookHandler,
    },
    {
        // fitur query params
        method: 'GET',
        path: '/books',
        handler: getAllBookHandler 
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getAllBookByIdHandler
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: editBookByIdHandler
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookByIdHandler
    }
]

module.exports = routes;