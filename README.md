# eleventy-plugin-umami

Get the stats of your selfhosted [umami](https://umami.is/)-instance and use them in your [11ty](https://www.11ty.dev/)-project using this plugin. You can find the page of the npm-package here: https://www.npmjs.com/package/eleventy-plugin-umami

## How to use

1. Install this plugin with `npm install eleventy-plugin-umami`
2. In your `.eleventy.js`:

```js
const umamiPlugin = require("eleventy-plugin-umami");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(umamiPlugin, {
    url: UMAMI_URL,
    username: UMAMI_USERNAME,
    password: UMAMI_PASSWORD,
    websiteId: UMAMI_WEBSITE_ID,
    start: moment().subtract(1, "month").valueOf(), // example values to get the stats of the last month
    end: moment().valueOf(),
  });
};
```

## Variables

| Variable    | Description                                                                                                                             |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `url`       | Defines the URL of your Umami instance. Only self-hosted instances are supported.                                                       |
| `username`  | Defines the username used for logging into Umami.                                                                                       |
| `password`  | Defines the password used for logging into Umami.                                                                                       |
| `websiteId` | Defines the unique ID for your website.                                                                                                 |
| `start`     | Defines the start-date of the stats. This need to be in milliseconds. The js-function for this is `getTime()`, moment uses `valueOf()`. |
| `end`       | Defines the end-date of the stats. This need to be in milliseconds. The js-function for this is `getTime()`, moment uses `valueOf()`.   |

<b>Please do not use this variables in clear-text. Instead use packages like [dotenv](https://www.npmjs.com/package/dotenv)</b>

## Optional Variables

| Variable   | Description                        |
| ---------- | ---------------------------------- |
| `url`      | Name of the URL.                   |
| `referrer` | Name of the referrer.              |
| `title`    | Name of the page title.            |
| `query`    | Name of the query.                 |
| `event`    | Name of the event.                 |
| `host`     | Name of the hostname.              |
| `os`       | Name of the operating system.      |
| `browser`  | Name of the browser.               |
| `device`   | Name of the device (e.g., Mobile). |
| `country`  | Name of the country.               |
| `region`   | Name of the region/state/province. |
| `city`     | Name of the city.                  |

## Usage in 11ty

This plugin creates global data which includes all of the data that the stats-endpoint of the umami-API offers

```json
// Example-values
{
  "pageviews": { "value": 3018, "prev": 3508 },
  "visitors": { "value": 847, "prev": 910 },
  "visits": { "value": 984, "prev": 1080 },
  "bounces": { "value": 537, "prev": 628 },
  "totaltime": { "value": 150492, "prev": 164713 }
}
```

If you want to use it you can access the collection like this:

```md
| Metric      | Value                       | Previous Value             |
| ----------- | --------------------------- | -------------------------- |
| `pageviews` | {{ umami.pageviews.value }} | {{ umami.pageviews.prev }} |
| `visitors`  | {{ umami.visitors.value }}  | {{ umami.visitors.prev }}  |
| `visits`    | {{ umami.visits.value }}    | {{ umami.visits.prev }}    |
| `bounces`   | {{ umami.bounces.value }}   | {{ umami.bounces.prev }}   |
| `totaltime` | {{ umami.totaltime.value }} | {{ umami.totaltime.prev }} |
```

which renders like this

| Metric      | Value  | Previous Value |
| ----------- | ------ | -------------- |
| `pageviews` | 3018   | 3508           |
| `visitors`  | 847    | 910            |
| `visits`    | 984    | 1080           |
| `bounces`   | 537    | 628            |
| `totaltime` | 150492 | 164713         |

## Changes in 2.0.0

- Dependencies have been removed. This plugin now has not a single dependency anymore and instead relies on the Fetch API.
- Instead of a collection this plugin now supplies the gathered data via global data. All you need to do is remove `collections` from your files, for example `{{ collections.umami.pageviews.value }}` turns into `{{ umami.pageviews.value }}`.
