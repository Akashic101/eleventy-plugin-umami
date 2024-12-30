# eleventy-plugin-umami

Get the stats of your selfhosted umami-instance and use them in your 11ty-project using this plugin

## How to use

1. Install this plugin with `npm install eleventy-plugin-umami`
2. In your `.eleventy.js`:

```js
const umamiPlugin = require('eleventy-plugin-umami');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(umamiPlugin, {
  	url: UMAMI_URL,
  	username: UMAMI_USERNAME,
  	password: UMAMI_PASSWORD,
  	websiteId: UMAMI_WEBSITE_ID,
  	start: moment().subtract(1, 'month').valueOf(), // example values to get the stats of the last month
  	end: moment().valueOf(),
  });
}

```

## Variables

| Variable     | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| `url`        | Defines the URL of your Umami instance. Only self-hosted instances are supported. |
| `username`   | Defines the username used for logging into Umami.                           |
| `password`   | Defines the token used for logging into Umami.                             |
| `websiteId`  | Defines the unique ID for your website.                                     |
| `start`  | Defines the start-date of the stats. This need to be in milliseconds. The js-function for this is `getTime()`, moment uses `valueOf()`. 
| `end`  | Defines the end-date of the stats. This need to be in milliseconds. The js-function for this is `getTime()`, moment uses `valueOf()`. 

 <b>Please do not use this variables in clear-text. Instead use packages like [dotenv](https://www.npmjs.com/package/dotenv)</b>

## Optional Variables

| Variable     | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| `url`        | Name of the URL.                                                            |
| `referrer`   | Name of the referrer.                                                       |
| `title`      | Name of the page title.                                                     |
| `query`      | Name of the query.                                                          |
| `event`      | Name of the event.                                                          |
| `host`       | Name of the hostname.                                                       |
| `os`         | Name of the operating system.                                               |
| `browser`    | Name of the browser.                                                        |
| `device`     | Name of the device (e.g., Mobile).                                          |
| `country`    | Name of the country.                                                        |
| `region`     | Name of the region/state/province.                                          |
| `city`       | Name of the city.                                                           |

## Usage in 11ty

This plugin creates a collection which includes all of the data that the stats-endpoint of the umami-API offers
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
| Metric      |                     Value                |               Previous Value             |
|-------------|------------------------------------------|------------------------------------------|
| `pageviews` | {{ collections.umami.pageviews.value }}  | {{ collections.umami.pageviews.prev }}   |
| `visitors`  | {{ collections.umami.visitors.value }}   | {{ collections.umami.visitors.prev }}    |
| `visits`    | {{ collections.umami.visits.value }}     | {{ collections.umami.visits.prev }}      |
| `bounces`   | {{ collections.umami.bounces.value }}    | {{ collections.umami.bounces.prev }}     |
| `totaltime` | {{ collections.umami.totaltime.value }}  | {{ collections.umami.totaltime.prev }}   |

```

which renders like this

| Metric      | Value | Previous Value |
|-------------|-------|----------------|
| `pageviews` | 3018  | 3508           |
| `visitors`  | 847   | 910            |
| `visits`    | 984   | 1080           |
| `bounces`   | 537   | 628            |
| `totaltime` | 150492| 164713         |

## TODO

* Right now this plugin only supports a single websiteId. In the future I would like to add support for more multiple id's.
* Umami offers more data in other endpoints such as active users, events, metric for specific subpages and pageviews in a specific timeframe. Enabling those would be a nice addition.