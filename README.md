# Payso-Check-Slip-Dashboard-Client

A web application designed to provide a comprehensive dashboard for managing and monitoring merchant transactions. Built using SvelteKit, run with server-side application (SRR) offers a user-friendly interface for viewing transaction details, generating reports, and analyzing data.

## Features
1. Merchant Transaction Management: View and manage detailed transaction records, including status updates and verification dates.
2. Data Visualization: Utilize charts and graphs to visualize transaction data and merchant statistics.
3. Responsive Design: Ensure a seamless experience across various devices with a responsive layout.
4. Admin Dashboard: Access an admin-specific dashboard for overseeing merchant activities and generating reports.
5. API Integration: Connect to external APIs for real-time data fetching and updates.

## Project Structure
The project is organized as follows:

1. src/: Contains the main source code for the application.
2. lib/: Includes reusable components and utilities.
3. routes/: Defines the application's routing structure.
4. static/: Holds static assets like images and fonts.
5. build/: Contains the built application files.
6. .svelte-kit/: Generated files and configurations for SvelteKit.
7. Dockerfile.app: Docker configuration for building and 8. running the SvelteKit application.
9. Dockerfile.nginx: Docker configuration for setting up Nginx to serve the application.
10. nginx.conf: Nginx configuration file for proxying requests to the SvelteKit application.
11. docker-compose.yml: Docker Compose configuration for orchestrating the SvelteKit and Nginx containers.
12. package.json: Project dependencies and scripts.
13. README.md: Project documentation.

## Getting Started
To get started with the Payso-Check-Slip-Dashboard-Client, follow these steps:

### Install Dependencies:
```sh
npm install
```

Run the Development Server:
```sh
npm run dev
```

Run with Docker:
```sh
docker-compose up --build
```

## Technologies Used
1.  SvelteKit: A framework for building high-performance web applications.
2. Tailwind CSS: A utility-first CSS framework for styling.
3. DaisyUI: A component library for Tailwind CSS.
4. Chart.js: A JavaScript library for creating charts.
5. Docker: Containerization platform for building and running the application.
<!-- Nginx: A web server used for serving the application and proxying requests. -->