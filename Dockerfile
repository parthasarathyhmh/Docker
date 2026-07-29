# Use Node.js 20
FROM node:20-alpine

# Create working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build NestJS project
RUN npm run build

# Expose NestJS port
EXPOSE 3000

# Start application
CMD ["node", "dist/main.js"]