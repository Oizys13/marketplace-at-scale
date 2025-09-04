# Use Node.js 18
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json tsconfig.json ./
RUN npm install

# Copy the rest of the source code
COPY ./src ./src

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3002

# Start service
CMD ["npm", "start"]
