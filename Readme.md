# ecommerce Product Scraper API

This is a simple Node.js API that scrapes product listings from eBay.

## Features

- Scrapes eBay product listings based on a search query.
- Scrapes Detail Product Shopee Taiwan
- Supports pagination.
- Provides a REST API endpoint to fetch scraped data.

## Installation

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (>= 14.x recommended)
- npm or yarn

### Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/ebay-scraper.git
   cd ebay-scraper
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Configuration

Set up your environment variables in a `.env` file (if needed). Modify the `config/config.js` file with your base URL and other necessary configurations.

Example `config/config.js`:

```js
module.exports = {
  EBAY_BASE_URL: "https://www.ebay.com/sch/i.html?_nkw={query}&_pgn={page}",
};
```

## Usage

### Start the Server

```sh
node app.js
```

The server will run on `http://localhost:3000` by default.

### API Endpoints

#### Scrape eBay Products

**Endpoint:** `GET /api/scrape`

**Query Parameters:**

- `query` (string) - The search term for eBay.
- `pages` (number) - The number of pages to scrape (default: 1).

**Example Request:**

```sh
curl "http://localhost:3000/api/scrape?query=laptop&pages=2"
```

**Example Response:**

```json
[
  {
    "title": "New Apple MacBook Pro 16-inch",
    "price": "$2,499",
    "url": "https://www.ebay.com/itm/1234567890"
  },
  {
    "title": "Dell XPS 13 Laptop",
    "price": "$1,299",
    "url": "https://www.ebay.com/itm/9876543210"
  }
]
```

## Project Structure

```
.
├── config/
│   ├── config.js        # Configuration file
├── controllers/
│   ├── scrapeController.js  # Handles the scraping logic
├── routes/
│   ├── scrapeRoutes.js  # API routes
├── utils/
│   ├── scraper.js       # Scraper logic
├── app.js               # Main server file
├── package.json         # Dependencies and scripts
├── README.md            # Project documentation
```

## License

This project is licensed under the MIT License.

## Author

[Your Name](https://github.com/your-username)
