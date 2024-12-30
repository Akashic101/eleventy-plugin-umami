const axios = require("axios");

// Function to authenticate and get the token
async function authenticate(baseUrl, username, password) {
  try {
    const response = await axios.post(`${baseUrl}/api/auth/login`, {
      username,
      password,
    });
    return response.data.token;
  } catch (error) {
    throw new Error("Authentication failed: " + (error.response?.data || error.message));
  }
}

// Function to fetch website stats
async function fetchWebsiteStats(baseUrl, websiteId, token, startAt, endAt, optionalParams) {
  try {
    const options = {
      method: 'GET',
      url: `${baseUrl}/api/websites/${websiteId}/stats`,
      params: {
        startAt,
        endAt,
        ...optionalParams // Spread the optional params if they exist
      },
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching website stats: " + (error.response?.data || error.message));
  }
}

// Function to map the raw stats data into a structured format
function formatStatsData(stats) {
  return {
    pageviews: { value: stats.pageviews.value, prev: stats.pageviews.prev },
    visitors: { value: stats.visitors.value, prev: stats.visitors.prev },
    visits: { value: stats.visits.value, prev: stats.visits.prev },
    bounces: { value: stats.bounces.value, prev: stats.bounces.prev },
    totaltime: { value: stats.totaltime.value, prev: stats.totaltime.prev },
  };
}

// Main plugin function
module.exports = async function (eleventyConfig, pluginOptions) {
  const { url: baseUrl, username, password, websiteId, start, end, ...optionalParams } = pluginOptions;

  try {
    // Step 1: Authenticate and get the token
    const token = await authenticate(baseUrl, username, password);

    // Step 2: Fetch website stats with optional parameters
    const stats = await fetchWebsiteStats(baseUrl, websiteId, token, start, end, optionalParams);

    // Step 3: Format the stats data
    const formattedData = formatStatsData(stats);

    // Step 4: Return the data as a collection
    eleventyConfig.addCollection('umami', () => {
      const umami = formattedData;
      return umami;
    });

  } catch (error) {
    console.error("Error:", error.message);
  }
};
