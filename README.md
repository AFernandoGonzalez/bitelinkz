# Bitelinkz - URL Shortener Project

Welcome to the URL Shortener project!

This project with both backend and frontend components.This project provides a web-based URL shortening service with a variety of features. It allows users to shorten long URLs and manage their links conveniently.

## Table of Contents

- [Features](#features)
- [Installation](#installation)

## Features

1. **Listing Shortened URLs:**

   - Displays a table listing the shortened URLs with details like Original URL, Short URL, URL Views, Created Date, and Expiration Date.

2. **Search Functionality:**

   - Includes a search bar to filter URLs based on the original URL. It updates the displayed URLs dynamically as the user types.

3. **Filtering and Sorting:**

   - Allows users to filter URLs based on expiration date and sort them by expiration date or number of visits.

4. **Bulk Operations:**

   - Supports the selection of multiple URLs for bulk operations such as deletion.

5. **Pagination:**

   - Implements pagination for the list of URLs, allowing users to navigate through different pages.

6. **Export to CSV:**

   - Enables users to export the displayed URLs to a CSV file for further analysis.

7. **URL Update:**

   - Allows updating the original URL and expiration date for a specific shortened URL.

8. **QR Code Generation:**

   - Allows users to view the QR code associated with a shortened URL.

9. **URL Sharing:**

   - Provides options to share the shortened URL on Twitter and WhatsApp.

10. **Copy to Clipboard:**

    - Allows users to copy the shortened URL to the clipboard.

11. **Styling and Theming:**

    - Implements styling for a visually appealing user interface. Supports light and dark themes.

12. **Date Formatting:**

    - Formats dates for better readability.

13. **Toasts for User Feedback:**

    - Displays toasts for notifying users about successful or failed operations.

14. **Responsive Design:**

    - Supports responsive design for different screen sizes.

15. **Download QR Code:**

    - Allows users to download the QR code image in different formats (png, jpeg, webp).

16. **External Libraries:**
    - Utilizes external libraries such as `react-toastify`, `react-share`, and `react-csv` for enhanced functionality.

## Installation

Provide instructions on how to install and set up the project locally.

1. Clone the repository:

   ```
   git clone https://github.com/AFernandoGonzalez/bitelinkz.git

   ```

### Frontend (Vite)

```
cd frontend
```
```
npm install
```
```
npm run dev

```

### Backend

```
cd backend
```
```
npm install
```
```
npm start

```
