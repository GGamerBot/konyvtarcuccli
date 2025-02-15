import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Input,
  Select,
  Pagination,
} from "@/components/ui";

const App = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("asc");
  const [newBook, setNewBook] = useState({
    author: "",
    title: "",
    year: "",
    genre: "",
    pages: "",
    available: true,
  });

  useEffect(() => {
    fetchBooks();
  }, [page, limit, sortBy, order]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/books", {
        params: { page, limit, sort_by: sortBy, order },
      });
      setBooks(response.data.books);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleAddBook = async () => {
    try {
      await axios.post("http://localhost:5000/books", newBook);
      fetchBooks();
      setNewBook({
        author: "",
        title: "",
        year: "",
        genre: "",
        pages: "",
        available: true,
      });
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await axios.delete(`http://localhost:5000/books/${id}`);
        fetchBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  const handleUpdateBook = async (id, updates) => {
    try {
      await axios.patch(`http://localhost:5000/books/${id}`, updates);
      fetchBooks();
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Library Management</h1>

      {/* Add Book Form */}
      <div className="mb-6">
        <h2 className="text-xl mb-2">Add New Book</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Author"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          />
          <Input
            placeholder="Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Year"
            value={newBook.year}
            onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
          />
          <Input
            placeholder="Genre"
            value={newBook.genre}
            onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Pages"
            value={newBook.pages}
            onChange={(e) => setNewBook({ ...newBook, pages: e.target.value })}
          />
          <Select
            value={newBook.available}
            onChange={(e) => setNewBook({ ...newBook, available: e.target.value === "true" })}
          >
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </Select>
          <Button onClick={handleAddBook}>Add Book</Button>
        </div>
      </div>

      {/* Book List */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {books.map((book) => (
          <Card key={book.id}>
            <CardHeader>
              <h3 className="text-lg font-semibold">
                {book.author} - {book.title}
              </h3>
            </CardHeader>
            <CardContent>
              <p>Year: {book.year}</p>
              <p>Genre: {book.genre}</p>
              <p>Pages: {book.pages}</p>
              <p>{book.available ? "Available" : "Not Available"}</p>
              <Button onClick={() => handleDeleteBook(book.id)}>Delete</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(books.length / limit)}
        onPageChange={setPage}
      />
    </div>
  );
};

export default App;
