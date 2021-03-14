# CRYPTO BACKEND

## Steps

1. Clone the repository in your local machine

```
git clone https://github.com/frankfullstack/crypto_be.git
```

2. Install the required dependencies

```
npm install
```

3. Launch your Docker process in order to execute Docker Compose to get access to the MySQL database. Execute the next command in order to make available the Database in the root of the backend cloned project

```
docker-compose up -d
```

4. Open your SQL Editor as MySQL Workbench, copy the content of the `script.sql` file located at the root of the project, and paste in order to execute and seed the database.

5. Run the NestJS Server in order to make available the API REST and the WebSocket Gateway.

```
npm run start:debug
````
