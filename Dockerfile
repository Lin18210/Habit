FROM node:18

WORKDIR /app

# Copy only package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Rebuild bcrypt for the container environment
RUN npm rebuild bcrypt --build-from-source

# Generate Prisma client
RUN npx prisma generate

EXPOSE 5001
CMD ["node", "./src/server.js"]