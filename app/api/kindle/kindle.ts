export async function checkKindleUnlimited(
  title: string
): Promise<boolean> {
  try {
    const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(
      title
    )}`;

    const res = await fetch(searchUrl, {
      headers: {
        // helps avoid some basic bot blocking
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        Accept: "text/html",
      },
    });

      console.log("CHECKING:", title);
const html = await res.text();

console.log("CHECKING:", title);
console.log("Status:", res.status);

// Find where "Kindle Unlimited" first appears
const index = html.indexOf("Kindle Unlimited");

console.log("Found at:", index);

if (index !== -1) {
  console.log(
    html.slice(
      Math.max(0, index - 200),
      Math.min(html.length, index + 500)
    )
  );
}

return (
  html.includes("Kindle Unlimited") ||
  html.includes("Read for Free") ||
  html.includes("Included with Kindle Unlimited")
);
  } catch (error) {
    console.error("KU CHECK ERROR:", error);
    return false;
  }
}