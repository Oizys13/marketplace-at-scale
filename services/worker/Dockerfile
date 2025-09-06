# Use Node.js 18 as base
FROM node:18

# Create working directory
WORKDIR /app

# Copy package.json and tsconfig.json first (for dependency install)
COPY package.json tsconfig.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY ./src ./src

# Build the TypeScript code
RUN npm run build

# Expose no port because this worker runs in background
CMD ["node", "dist/index.js"]
