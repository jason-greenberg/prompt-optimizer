# ZipCover
ZipCover is a tool designed to simplify the process of writing and editing cover letters for job applications. Whether you're a junior web developer looking for your first job or an experienced professional seeking a new challenge, ZipCover is the perfect tool for you.

[![My Skills](https://skillicons.dev/icons?i=py,flask,postgres,react,redux,js,css)](https://skillicons.dev)

## Live Site
https://promptly.onrender.com

## Features
- Generate optimized LLM prompts from simple user input

## Tech Stack
Promptly has been built using the following technologies:

- Python
- Flask
- PostgreSQL
- React.js
- Redux
- Javascript
- CSS

## Prerequisites
Before you can start using Promptly, you will need to set up the following environment variables using a .env file:

```
DATABASE_URL
FLASK_APP
FLASK_ENV
JWT_EXPIRES_IN
JWT_SECRET
NODE_ENV (e.g. production or development)
SCHEMA (for database configuration, e.g. 'zipcover_data')
OPENAI_API_KEY (found under your OpenAI account)
REACT_APP_BASE_URL (e.g. zipcover.onrender.com)
```
## **Build**
To install and build the front and backend, run the following command:
```bash
npm install --prefix react-app && npm run build --prefix react-app && pip install -r requirements.txt && pip install psycopg2 && flask db upgrade && flask seed all
```
The API comes seeded with 3 demo users for testing purposes. The build command will migrate the Users table and seed it with these 3 users.
## **Start**
To start the application, run the following command:
```bash
gunicorn app:app --timeout 120
```
