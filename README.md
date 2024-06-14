# CollabMate

CollabMate is a collaborative project management tool designed to help teams work together efficiently. It provides features for managing projects, chatting with team members, and maintaining friendships within the platform.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Scripts](#scripts)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- Project Management: Create and manage projects with ease.
- Chat: Communicate with team members in real-time.
- Friendship: Connect and collaborate with friends.
- User Settings: Customize your profile and preferences.

## Installation

### Prerequisites

Ensure you have the following installed on your system:

- Node.js (version 14.x or later)
- npm (version 6.x or later)

### Steps

1. Clone the repository:

    ```sh
    git clone https://github.com/metodej-janota/collabmate.git
    cd collabmate
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables (refer to `.env.example` if provided).

4. Run the development server:

    ```sh
    npm run dev
    ```

5. Open your browser and navigate to `http://localhost:3000`.

## Usage

- **Homepage**: Navigate to the homepage to see an overview of your projects.
- **Login/Register**: Create a new account or log in to an existing one.
- **Dashboard**: Access your dashboard to manage projects and friendships.
- **Chat**: Use the chat feature to communicate with your project team members.

## Configuration

### Environment Variables

Set up the following environment variables in your `.env` file:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key.

## Scripts

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm start`: Starts the production build of the app.
- `npm run lint`: Runs ESLint for code quality checks.


## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) to learn how you can help.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.


