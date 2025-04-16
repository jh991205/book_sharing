import { useState, useEffect } from "react";
import * as bookClient from "./client";

// Simplified BookFilter: dropdown + partial-search input
// onSearch is a callback prop that receives the selected or typed query
// and triggers the parent component's searchBooks function.
export default function BookFilter({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState("");

  // Fetch all books on mount using async/await
  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const books = await bookClient.findAllBooks();
        setOptions(books.map((b: any) => b.bookTitle));
      } catch (err) {
        console.error("Error loading books:", err);
      }
    };
    fetchAllBooks();
  }, []);

  // Filter books by name or reset list
  const filterBooksByName = async (name: string) => {
    try {
      let books;
      if (name) {
        books = await bookClient.findBooksByPartialTitle(name);
      } else {
        books = await bookClient.findAllBooks();
      }
      setOptions(books.map((b: any) => b.bookTitle));
    } catch (err) {
      console.error("Search API error:", err);
    }
  };

  return (
    <div className="d-flex flex-column mb-3" style={{ width: "300px" }}>
      <input
        type="text"
        placeholder="Type to search..."
        className="form-control wd-search-input"
        onChange={(e) => filterBooksByName(e.target.value)}
      />
      <select
        size={30}
        value={selected}
        onChange={(e) => {
          const value = e.target.value;
          setSelected(value);
          onSearch(value);
        }}
        className="form-select me-2 wd-select-book"
      >
        <option value="">-- Select a book --</option>
        {options.map((title, idx) => (
          <option key={idx} value={title}>
            {title}
          </option>
        ))}
      </select>
    </div>
  );
}
