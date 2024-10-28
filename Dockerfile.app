# Use the official Node.js image as the base image
FROM node:20-alpine3.20 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the SvelteKit application
RUN npm run build

# Use a minimal Node.js image for the runtime
FROM node:20-alpine3.20 AS runtime

# Set the working directory
WORKDIR /app

# Copy the built application from the build stage
COPY --from=build /app/build ./build
COPY --from=build /app/package*.json ./

RUN npm install --production

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "build/index.js"]

