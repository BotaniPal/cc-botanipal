# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --save-dev typescript @types/react @types/node
RUN npx tsc --init
RUN npm install -D tailwindcss postcss autoprefixer
RUN npx tailwindcss init -p
RUN npm install aos
RUN npm i --save-dev @types/aos
RUN npm install react-icons
RUN yarn add react-icons
RUN npm install @tailwindcss/forms
RUN yarn add @tailwindcss/forms

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
