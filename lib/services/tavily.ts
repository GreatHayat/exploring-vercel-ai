const URL = "https://api.tavily.com/search";

export const getSearchResults = async (query: string) => {
  const payload = {
    api_key: process.env.NEXT_PUBLIC_TAVILY_API_KEY,
    query: query,
    search_depth: "basic",
    include_answer: true,
    max_results: 3,
  };
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const results = await response.json();
  //   console.log(results);
  return results;
};
