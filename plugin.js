const { URLSearchParams } = require("url");

async function authenticate(baseUrl, username, password) {
  try {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        "Authentication failed: " + (errorData.message || response.statusText)
      );
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    throw new Error("Authentication failed: " + error.message);
  }
}

async function fetchWebsiteStats(
  baseUrl,
  websiteId,
  token,
  startAt,
  endAt,
  optionalParams
) {
  try {
    const params = new URLSearchParams({
      startAt,
      endAt,
      ...optionalParams,
    }).toString();

    const url = `${baseUrl}/api/websites/${websiteId}/stats?${params}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        "Error fetching website stats: " +
          (errorData.message || response.statusText)
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error fetching website stats: " + error.message);
  }
}

function formatStatsData(stats) {
  return {
    pageviews: { value: stats.pageviews.value, prev: stats.pageviews.prev },
    visitors: { value: stats.visitors.value, prev: stats.visitors.prev },
    visits: { value: stats.visits.value, prev: stats.visits.prev },
    bounces: { value: stats.bounces.value, prev: stats.bounces.prev },
    totaltime: { value: stats.totaltime.value, prev: stats.totaltime.prev },
  };
}

module.exports = async function (eleventyConfig, pluginOptions) {
  const {
    url: baseUrl,
    username,
    password,
    websiteId,
    start,
    end,
    ...optionalParams
  } = pluginOptions;

  try {
    // Step 1: Authenticate and get the token
    const token = await authenticate(baseUrl, username, password);

    // Step 2: Fetch website stats with optional parameters
    const stats = await fetchWebsiteStats(
      baseUrl,
      websiteId,
      token,
      start,
      end,
      optionalParams
    );

    // Step 3: Format the stats data
    const formattedData = formatStatsData(stats);

    // Step 4: Return the data as a collection
    eleventyConfig.addGlobalData("umami", formattedData);
  } catch (error) {
    console.error("Error:", error.message);
  }
};
