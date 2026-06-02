"use client";

import { useState } from "react";
import "./page.css";
import { checkKindleUnlimited } from "./lib/kindle";
import pLimit from "p-limit";

export default function Home() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const limit = pLimit(2);

  async function handleSearch() {
    try {
      setLoading(true);

      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`,
      );

      const data = await res.json();

      const items = data.items || [];

      // enrich books with Kindle data
      const enrichedBooks = await Promise.all(
        items.map((book: any) =>
          limit(async () => {
            const info = book.volumeInfo;

            let kindleUnlimited = false;

            try {
              kindleUnlimited = await checkKindleUnlimited(info.title);
            } catch (err) {
              console.error(err);
            }

            return {
              id: book.id,
              volumeInfo: info,
              kindleUnlimited,
            };
          }),
        ),
      );

      setBooks(enrichedBooks);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="main">
      <h1 className="header">Nicole's book finder</h1>
      <p className="descText">
        Search to find if a book is at the CPL or kindle unlimited
      </p>

      <div className="searchBarContainer">
        <input
          className="searchBar"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books..."
        />

        <button type="button" className="searchButton" onClick={handleSearch}>
          Search
        </button>
      </div>
      {loading && (
        <div className="text-center py-8">
          <p className="text-lg font-medium">Loading...</p>
        </div>
      )}

      <div className="grid gap-4">
        {books.length > 0 &&
          books.map((book) => {
            const info = book.volumeInfo;

            return (
              <div key={book.id} className="border rounded-lg p-4 flex gap-4">
                {info.imageLinks?.thumbnail && (
                  <img
                    src={info.imageLinks.thumbnail}
                    alt={info.title}
                    className="w-24 h-auto rounded"
                  />
                )}

                <div>
                  <h2 className="text-xl font-bold">{info.title}</h2>

                  <p className="text-gray-600">
                    {info.authors?.join(", ") || "Unknown author"}
                  </p>

                  {/* placeholder until you wire up real data */}
                  <p className="mt-2">
                    {book.kindleUnlimited
                      ? "✅ Kindle Unlimited"
                      : "❌ Not on Kindle Unlimited"}
                  </p>

                  <p>❌ Chicago Public Library check not implemented</p>
                </div>
              </div>
            );
          })}
      </div>
    </main>
  );
}
