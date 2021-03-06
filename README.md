# Speedtest
A NodeJS API serving internet connection statistics from MongoDB to a React front end, with D3 data visualization.

![speedtest screenshot](https://raw.githubusercontent.com/NewEvolution/speedtest/master/speedtest_screenshot.png)

## About
This app was written as an internal tool for [Nashville Software School](http://nashvillesoftwareschool.com) to display periodic internet speed test data in an easily navigable interface.

Prior to creation of this app I had a long-running script running [speedtest-cli](https://github.com/sivel/speedtest-cli) and storing hourly speed test information in a simple text file.  The `import.js` file in the utilities directory was crafted to parse this file and submit them via an HTTP POST to `/speedtest` for storage in MongoDB.

Get requests to `/speedtest` initiate a new speed test via [speedtest-cli](https://github.com/sivel/speedtest-cli) and save the returned data to MongoDB.

## Included Components
- [Airbnb's react-dates](https://github.com/airbnb/react-dates) date range picker component.
- [React D3's LineTooltip](http://www.reactd3.org/) D3 line graph component.

## Installation & Execution
- Install [NodeJS](https://nodejs.org)
- Install [speedtest-cli](https://github.com/sivel/speedtest-cli)
- Install [MongoDB](https://www.mongodb.com/)
- Start MongoDB by running `mongod` in a terminal
- Clone down this repository
- In a terminal within the repository directory:
  - Install required Node modules by running `npm install`
  - Generate output files by running `./node_modules/.bin/webpack`
  - Start the server by running `node server.js`

## Usage
##### Full Site
- In the browser of your choice, go to [`http://localhost:3000/speedtest`](http://localhost:3000/speedtest) a few times to populate the database with some speed test results.
- For gathering periodic results you could write a simple cron job running `curl` or `wget` to hit `http://localhost:3000/speedtest` hourly.
- Navigate to [`http://localhost:3000`](http://localhost:3000/) to view the visualization of the speed test data in the database.
- The top day, week, month & year time span buttons control the span of time displayed in the graph.
- Left and right navigation buttons jump forward and back in time by the amount selected by the time span buttons.
- Clicking the displayed dates opens a calendar chooser to select a custom time range for display.
##### API
- [`http://localhost:3000/api/`](http://localhost:3000/api) - provides hourly speed test data for the current day.
- [`http://localhost:3000/api/day/<date>`](http://localhost:3000/api/day/20161201) - provides hourly speed test data for the specified `<date>` provided in `YYYYMMDD` format.
- [`http://localhost:3000/api/week/<date>`](http://localhost:3000/api/week/20161201) - provides hourly speed test data for the specified week beginning on the `<date>` provided in `YYYYMMDD` format.
- [`http://localhost:3000/api/month/<month>`](http://localhost:3000/api/month/201612) - provides speed test data summarized by day for the specified `<month>` provided in `YYYYMM` format.
- [`http://localhost:3000/api/year/<year>`](http://localhost:3000/api/year/2016) - provides speed test data summarized by week for the specified `<year>` provided in `YYYY` format.
- [`http://localhost:3000/api/span/<start_date>/<end_date>`](http://localhost:3000/api/span/20161202/20161205) - provides speed test data for the time span between `<start_date>` and `<end_date>`, both provided in `YYYYMMDD` format.

## Configuration
The file `src/config.js` contains a configuration object for the React front end.
- **apiurl** - hostname:port for connecting to the API. Default of `localhost:3000`.
- **firstscan** - `YYYY-MM-DD` formatted date string for the first scan in the database. Default of `2016-04-25`.

Several environment variables can be used for additional configuration.
- **MONGODB_USER** - Username for connecting to MongoDB. Defaults to empty string.
- **MONGODB_PASS** - Password for connecting to MongoDB. Defaults to empty string.
- **MONGODB_HOST** - URL for MongoDB connection. Defaults to `localhost`.
- **MONGODB_PORT** - Port used for connecting go MongoDB. Defaults to `27017`.
- **PORT** - Port the Node web server listens on. Defaults to `3000`.
