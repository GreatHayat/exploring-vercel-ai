export const searchGoogleEvents = async (query: string) => {
  const apiKey = process.env.NEXT_PUBLIC_SERP_API_KEY;
  const url = `https://serpapi.com/search?engine=google_events&q=${query}&hl=en&gl=us&api_key=${apiKey}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const results = await response.json();
  //   console.log(results);
  return results;
};
