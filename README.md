### Planner API

This project is a REST API built with Node.js, it provides endpoints for managing trips, participants, activities, and important links.

#### Technologies

* **Node.js**: JavaScript runtime for building server-side applications.
* **TypeScript**: Typed superset of JavaScript for improved code quality and maintainability.
* **Fastify**: High-performance web framework for Node.js.
* **Prisma**: ORM for interacting with the database.
* **SQLite**: Embedded database for development and testing.
* **Zod**: TypeScript-first schema validation library.

#### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/planner.git
   ```
2. Install dependencies:
   ```bash
   cd planner
   npm install
   ```
3. Create a `.env` file based on the `.env.example` file, providing the necessary environment variables.

#### Development

* **Start the development server:**
  ```bash
  npm run dev
  ```
* **Run the linter:**
  ```bash
  npm run lint
  ```
* **Build the project:**
  ```bash
  npm run build
  ```
* **Start the production server:**
  ```bash
  npm start
  ```

#### Database

* **Run the database page visualization:**
  ```bash
  npm run db:studio
  ```
* **Seed the database:**
  ```bash
  npm run db:seed
  ```
* **Run migrations:**
  ```bash
  npm run db:migrate
  ```

#### API Documentation

API documentation is available at `/documentation` endpoint.