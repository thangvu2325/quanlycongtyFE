# Dockerfile

# Use node alpine as it's a small node image
FROM node:alpine

# Create the directory on the node image 
# where our React app will live
RUN mkdir -p /src

# Set /app as the working directory
WORKDIR /src

# Copy package.json and package-lock.json
# to the /app working directory
COPY package*.json /src

# Install dependencies in /app
RUN npm install

# Copy the rest of our React folder into /src
COPY . /src

# Ensure port 3000 is accessible to our system
EXPOSE 3000

# Run yarn dev, as we would via the command line 
CMD npm run start