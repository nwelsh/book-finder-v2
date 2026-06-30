export async function checkChicagoLibrary(
  title: string,
  author?: string,
) {
  try {
    const query = encodeURIComponent(
      author ? `${title} ${author}` : title,
    );

    const url = `https://chipublib.bibliocommons.com/v2/search?query=${query}&searchType=smart`;

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      },
    });

    const html = await res.text();

    const found =
      html.toLowerCase().includes(title.toLowerCase()) ||
      html.includes("Search Results");

    return {
      available: found,
      url,
    };
  } catch (e) {
    console.error(e);

    return {
      available: false,
      url: "",
    };
  }
}