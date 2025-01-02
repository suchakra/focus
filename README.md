# Focus Home Page

This project is a simple home page for your browser that displays the current date and time, and allows you to manage your goals (annual, monthly, weekly, and daily). It also fetches a daily background image from the Unsplash API.

## Setup

To set up this project on your local machine, follow these steps:

### Installation

1. **Clone the Repository**:
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Install Dependencies**:
    ```sh
    npm install
    ```

3. **Create a `secrets.js` File**:
    Create a `secrets.js` file in the root of your project to store your Unsplash API key. This file should not be committed to version control.

    ```javascript
    const secrets = {
        unsplashAccessKey: "your_unsplash_access_key"
    };
    ```

4. **Set `index.html` as the Start Page in Chrome**:
    - Open Chrome and go to `Settings`.
    - Under the `On startup` section, select `Open a specific page or set of pages`.
    - Click `Add a new page` and enter the file path to your `index.html` file. For example, `file:///path/to/your/project/index.html`.

### Project Structure

- `index.html`: The main HTML file for the home page.
- `styles.css`: The CSS file for styling the home page.
- `script.js`: The JavaScript file for handling the functionality of the home page.
- `secrets.js`: The JavaScript file that stores your Unsplash API key (not included in version control).

### Features

- Displays the current date and time.
- Allows you to manage your goals (annual, monthly, weekly, and daily).
- Fetches a daily background image from the Unsplash API.

### Security

To keep your API key secure, it is stored in the `secrets.js` file, which is not tracked by version control. This ensures that your API key is not exposed in your source code.

### License

This project is licensed under the MIT License.