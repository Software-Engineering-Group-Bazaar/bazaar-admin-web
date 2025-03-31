# Bazaar Admin Panel

Bazaar Admin Panel is the frontend application for managing the Bazaar eCommerce platform. Built using **Vite** and **React (JSX)**, this panel provides a fast and efficient interface for administrators to manage products, orders, customers, and more.

![Bazaar Admin Panel Screenshot](screenshot.png)

## Features
- Intuitive dashboard for managing eCommerce operations
- Product and order management
- User and role-based access control
- Optimized performance with Vite
- Modern UI with React JSX

## Prerequisites
Before setting up the project, ensure you have the following installed:
- **Node.js** (>= 18.x) [Download Here](https://nodejs.org/)
- **npm** (comes with Node.js)

## Getting Started
To get the Bazaar Admin Panel running on your local system, follow these steps:

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Software-Engineering-Group-Bazaar/bazaar-admin-web.git
   cd bazaar-admin
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```
   The application will be available at `http://localhost:5173/` by default.

## Build Instructions
To build the project for production:
```sh
npm run build
```

The optimized files will be available in the `dist/` directory.

## Running Tests
If the project includes unit tests, run them using:
```sh
npm run test
```

## Contribution
Contributions are welcome! To contribute:
1. Fork the repository
2. Create a new branch (`feature/your-feature`)
3. Commit your changes following **GitFlow** conventions:
   - `feature/{feature-name}` for new features
   - `hotfix/{hotfix-name}` for hotfixes
   - `release/{version}` for release preparation
   - `develop` as the main development branch
   ```sh
   git commit -m "feature: Add new dashboard widget"
   ```
4. Push to your branch (`git push origin feature/your-feature`)
5. Open a pull request

## Issue Reporting
If you encounter any issues, please report them in the [GitHub Issues](https://github.com/yourusername/bazaar-admin/issues) section.

## License
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.


## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
