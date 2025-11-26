# Library Management System - Web App

A web-based Library Management System built with Node.js/Express and vanilla HTML/CSS/JavaScript.

## Features

✅ **Add Books** - Add new books with ID, title, author, and quantity
✅ **View All Books** - Display all books in a beautiful card layout
✅ **Search Books** - Search for specific books by ID
✅ **Update Books** - Edit book details
✅ **Delete Books** - Remove books from the library
✅ **Persistent Storage** - Books data is saved to JSON file

## Prerequisites

- Node.js (v12 or higher)
- npm (comes with Node.js)

## Installation & Setup

1. Navigate to the project directory:
   ```bash
   cd library-web-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser and go to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
library-web-app/
├── server.js           # Express server and API routes
├── package.json        # Project dependencies
├── public/
│   ├── index.html      # Main HTML page
│   ├── style.css       # Styling
│   └── script.js       # Client-side JavaScript
└── books.json          # Data storage (auto-created)
```

## API Endpoints

- **GET** `/api/books` - Get all books
- **POST** `/api/books` - Add a new book
- **GET** `/api/books/:id` - Get a specific book
- **PUT** `/api/books/:id` - Update a book
- **DELETE** `/api/books/:id` - Delete a book

## Usage

1. **Add Book**: Fill in the form in the "Add Book" section and click "Add Book"
2. **View Books**: Click "View All Books" to see all books in the library
3. **Search Book**: Enter a Book ID in the search box to find a specific book
4. **Edit/Update**: Click the "Edit" button on any book card to update it
5. **Delete**: Click the "Delete" button to remove a book

## Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: JSON file (books.json)

## Features

- Responsive design works on desktop and mobile
- Real-time validation
- Error handling
- Clean and intuitive UI
- No external UI framework dependencies

## License

MIT
