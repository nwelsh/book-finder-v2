import axios from "axios";

export async function checkChicagoLibrary(
  title: string
) {
  try {
    const response = await axios.get(
      "https://thunder.api.overdrive.com/v2/libraries/chicago/media",
      {
        params: {
          query: title,
          maxItems: 10,
        },
      }
    );

    const items = response.data.items || [];

    let ebookAvailable = false;
    let ebookWaitlist = false;

    let audiobookAvailable = false;
    let audiobookWaitlist = false;

    for (const item of items) {
      const formats = item.formats || [];

      for (const format of formats) {
        const isAudiobook =
          format.id?.toLowerCase().includes("audio");

        const available =
          item.availableCopies > 0;

        if (isAudiobook) {
          if (available) {
            audiobookAvailable = true;
          } else {
            audiobookWaitlist = true;
          }
        } else {
          if (available) {
            ebookAvailable = true;
          } else {
            ebookWaitlist = true;
          }
        }
      }
    }

    return {
      exists: items.length > 0,
      ebookAvailable,
      ebookWaitlist,
      audiobookAvailable,
      audiobookWaitlist,
    };
  } catch (error) {
    console.error("LIBBY ERROR:", error);

    return {
      exists: false,
      ebookAvailable: false,
      ebookWaitlist: false,
      audiobookAvailable: false,
      audiobookWaitlist: false,
    };
  }
}