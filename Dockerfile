FROM node:20-alpine AS development

WORKDIR /learnhub-app

COPY package*.json ./

RUN npm install --force

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

### How to Run this Dockerfile
#1.  **Build the image**: In your project's root directory, run the following command to build the Docker image. The `--tag` flag gives your image a name.
#    ```bash
#    docker build -t learnhub-frontend .
#    ```
#
#2.  **Run the container**: Once the image is built, you can run it. The `-p 5173:5173` flag maps port `5173` from your local machine to port `5173` inside the container.
#    ```bash
#    docker run -d -p 5173:5173 learnhub-frontend
    
