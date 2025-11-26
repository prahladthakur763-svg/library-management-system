const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = 'books.json';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Helper function to read books from file
function getBooks() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

// Helper function to write books to file
function saveBooks(books) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(books, null, 2));
}

// API Routes

// Get all books
app.get('/api/books', (req, res) => {
    const books = getBooks();
    res.json(books);
});

// Add a new book
app.post('/api/books', (req, res) => {
    const { id, title, author, quantity } = req.body;

    // Validate input
    if (!id || !title || !author || quantity === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const books = getBooks();

    // Check if book ID already exists
    if (books.some(book => book.id === parseInt(id))) {
        return res.status(400).json({ error: 'Book ID already exists' });
    }

    const newBook = {
        id: parseInt(id),
        title: title.trim(),
        author: author.trim(),
        quantity: parseInt(quantity)
    };

    books.push(newBook);
    saveBooks(books);

    res.json({ message: 'Book added successfully!', book: newBook });
});

// Search book by ID
app.get('/api/books/:id', (req, res) => {
    const books = getBooks();
    const book = books.find(b => b.id === parseInt(req.params.id));

    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
});

// Update book by ID
app.put('/api/books/:id', (req, res) => {
    const { title, author, quantity } = req.body;
    const books = getBooks();
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));

    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    if (title) books[bookIndex].title = title.trim();
    if (author) books[bookIndex].author = author.trim();
    if (quantity !== undefined) books[bookIndex].quantity = parseInt(quantity);

    saveBooks(books);
    res.json({ message: 'Book updated successfully!', book: books[bookIndex] });
});

// Delete book by ID
app.delete('/api/books/:id', (req, res) => {
    const books = getBooks();
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));

    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const deletedBook = books.splice(bookIndex, 1);
    saveBooks(books);

    res.json({ message: 'Book deleted successfully!', book: deletedBook[0] });
});

// Start server
app.listen(PORT, () => {
    console.log(`Library Management System is running on http://localhost:${PORT}`);
});
