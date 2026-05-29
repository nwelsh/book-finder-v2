"use client";

import { useState } from "react";
import './page.css';

export default function Home() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    try {
      setLoading(true);

      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}`,
      );

      const data = await res.json();
      console.log("data", data)

      setBooks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="main">
      <h1 className="header">Nicole's book finder</h1>
      <p className="descText">Search to find if a book is at the CPL or kindle unlimited</p>

      <div className="flex gap-2 mb-6">
        <input
          className="searchBar"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books..."
        />

        <button
          type="button"
          className="searchButton"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      {loading && (
        <div className="text-center py-8">
          <p className="text-lg font-medium">Loading...</p>
        </div>
      )}

      <div className="grid gap-4">
        {books.length > 0 && books.map((book) => (
          <div key={book.id} className="border rounded-lg p-4 flex gap-4">
            {book.thumbnail && (
              <img
                src={book.thumbnail}
                alt={book.title}
                className="w-24 h-auto rounded"
              />
            )}

            <div>
              <h2 className="text-xl font-bold">{book.title}</h2>

              <p className="text-gray-600">{book.authors.join(", ")}</p>

              <p className="mt-2">
                {book.kindleUnlimited
                  ? "✅ Kindle Unlimited"
                  : "❌ Not on Kindle Unlimited"}
              </p>
              {book.library.exists ? (
                <div className="mt-2">
                  <p className="font-semibold">Chicago Public Library</p>

                  {book.library.ebookAvailable && <p>📖 Ebook Available Now</p>}

                  {book.library.ebookWaitlist && <p>⏳ Ebook Waitlist</p>}

                  {book.library.audiobookAvailable && (
                    <p>🎧 Audiobook Available Now</p>
                  )}

                  {book.library.audiobookWaitlist && (
                    <p>⏳ Audiobook Waitlist</p>
                  )}
                </div>
              ) : (
                <p>❌ Not in Chicago Public Library - test</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
