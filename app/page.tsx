"use client";

import { useState } from "react";
import "./page.css";
import pLimit from "p-limit";
import { checkKindleUnlimited } from "../app/api/kindle/kindle";

const limit = pLimit(2);

export default function Home() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query,
        )}&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_KEY}`,
      );

      console.log("Google response: ", res.status);

      const data = await res.json();
      console.log(data);

      const items = data.items || [];
      console.log("Items found:", items.length);

      const enrichedBooks = await Promise.all(
        items.map((book: any) =>
          limit(async () => {
            const info = book.volumeInfo;

            let kindleUnlimited = false;

            try {
              const kuRes = await fetch(
                `/api/kindle?title=${encodeURIComponent(info.title || "")}`,
              );

              const kuData = await kuRes.json();

              kindleUnlimited = kuData.kindleUnlimited;
            } catch (err) {
              console.error(`Kindle check failed for ${info.title}`, err);
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
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="main">
      <h1 className="header">Nicole's book finder</h1>

      <p className="descText">
        Search to find if a book is at the CPL or Kindle Unlimited
      </p>

      <div className="searchBarContainer">
        <input
          className="searchBar"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books"
        />

        <button type="button" className="searchButton" onClick={handleSearch}>
          Search
        </button>
      </div>

      {loading && (
        <div>
          <p className="loadingText">Loading...</p>
        </div>
      )}

      <div className="booksContainer">
        {books.map((book) => {
          const info = book.volumeInfo;

          return (
            <div key={book.id} className="bookCard">
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
