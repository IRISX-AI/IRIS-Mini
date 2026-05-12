# Use a lightweight Debian-based Node image for native C++ compatibility
FROM node:24-bookworm-slim

# Create the working directory inside the container
WORKDIR /usr/src/app

# Copy dependency manifests first (to cache the npm install step)
COPY package*.json ./

# Clean install all dependencies (including devDependencies needed for build)
RUN npm ci

# Copy the rest of your proprietary source code
COPY . .

# Build the heavily minified production UI and CLI binary
RUN npm run release

# Set essential environment variables
ENV NODE_ENV="production"
ENV IRIS_PRODUCTION="true"

# Expose the port your Express server uses
EXPOSE 6754

# Execute the compiled binary directly
CMD [ "node", "dist/cli.js" ]
