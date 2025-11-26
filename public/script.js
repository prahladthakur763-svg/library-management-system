// Menu navigation
document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const sectionId = this.getAttribute('data-section');
        
        // Remove active class from all buttons and sections
        document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        
        // Add active class to clicked button and corresponding section
        this.classList.add('active');
        document.getElementById(sectionId).classList.add('active');
        
        // Load books if view-books section is opened
        if (sectionId === 'view-books') {
            loadBooks();
        }
    });
});

// Add Book Form
document.getElementById('addBookForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const id = document.getElementById('bookId').value;
    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const quantity = document.getElementById('bookQuantity').value;
    
    try {
        const response = await fetch('/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: parseInt(id),
                title,
                author,
                quantity: parseInt(quantity)
            })
        });
        
        const data = await response.json();
        const messageDiv = document.getElementById('addMessage');
        
        if (response.ok) {
            messageDiv.className = 'message success';
            messageDiv.textContent = data.message;
            this.reset();
            setTimeout(() => {
                messageDiv.className = 'message';
            }, 3000);
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = data.error || 'Error adding book';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('addMessage').className = 'message error';
        document.getElementById('addMessage').textContent = 'Error adding book';
    }
});

// Load and display all books
async function loadBooks() {
    try {
        const response = await fetch('/api/books');
        const books = await response.json();
        const booksList = document.getElementById('booksList');
        
        if (books.length === 0) {
            booksList.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #999;">No books available. Add some books first!</p>';
            return;
        }
        
        booksList.innerHTML = books.map(book => `
            <div class="book-card">
                <h3>📖 ${book.title}</h3>
                <p><strong>ID:</strong> ${book.id}</p>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Quantity:</strong> ${book.quantity}</p>
                <div class="book-actions">
                    <button class="btn btn-warning" onclick="openEditModal(${book.id}, '${book.title.replace(/'/g, "\\'")}', '${book.author.replace(/'/g, "\\'")}', ${book.quantity})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteBook(${book.id})">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading books:', error);
        document.getElementById('booksList').innerHTML = '<p style="color: red;">Error loading books</p>';
    }
}

// Search book
async function searchBook() {
    const id = document.getElementById('searchId').value;
    
    if (!id) {
        alert('Please enter a Book ID');
        return;
    }
    
    try {
        const response = await fetch(`/api/books/${id}`);
        const searchResult = document.getElementById('searchResult');
        
        if (response.ok) {
            const book = await response.json();
            searchResult.innerHTML = `
                <div class="result-card">
                    <h3>✅ Book Found!</h3>
                    <p><strong>ID:</strong> ${book.id}</p>
                    <p><strong>Title:</strong> ${book.title}</p>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Quantity:</strong> ${book.quantity}</p>
                    <div class="book-actions">
                        <button class="btn btn-warning" onclick="openEditModal(${book.id}, '${book.title.replace(/'/g, "\\'")}', '${book.author.replace(/'/g, "\\'")}', ${book.quantity})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteBook(${book.id})">Delete</button>
                    </div>
                </div>
            `;
        } else {
            searchResult.innerHTML = '<div class="result-card" style="border-left-color: #dc3545;"><h3>❌ Book Not Found!</h3></div>';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('searchResult').innerHTML = '<p style="color: red;">Error searching book</p>';
    }
}

// Open edit modal
function openEditModal(id, title, author, quantity) {
    document.getElementById('editBookId').value = id;
    document.getElementById('editTitle').value = title;
    document.getElementById('editAuthor').value = author;
    document.getElementById('editQuantity').value = quantity;
    document.getElementById('editModal').classList.add('show');
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').classList.remove('show');
}

// Submit edit form
document.getElementById('editForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const id = document.getElementById('editBookId').value;
    const title = document.getElementById('editTitle').value;
    const author = document.getElementById('editAuthor').value;
    const quantity = document.getElementById('editQuantity').value;
    
    try {
        const response = await fetch(`/api/books/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                author,
                quantity: parseInt(quantity)
            })
        });
        
        if (response.ok) {
            alert('Book updated successfully!');
            closeEditModal();
            loadBooks();
        } else {
            alert('Error updating book');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error updating book');
    }
});

// Delete book
async function deleteBook(id) {
    if (confirm('Are you sure you want to delete this book?')) {
        try {
            const response = await fetch(`/api/books/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('Book deleted successfully!');
                // Reload current section
                const activeSection = document.querySelector('.section.active');
                if (activeSection.id === 'view-books') {
                    loadBooks();
                } else if (activeSection.id === 'search-book') {
                    document.getElementById('searchResult').innerHTML = '';
                }
            } else {
                alert('Error deleting book');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting book');
        }
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeEditModal();
    }
});
