Task Management API (Express + TypeScript)
A simple, in-memory RESTful API built with Node.js, Express, and TypeScript to manage a list of tasks.
🚀 Features
CRUD Operations: Create, Read, Update, and Delete tasks.
Type Safety: Built with TypeScript for better developer experience and error catching.
In-Memory Storage: Uses a local array to store data (resets when the server restarts).
🛠️ Prerequisites
Before running this project, ensure you have the following installed:
Node.js (v14 or higher)
npm (comes with Node)
📦 Installation & Setup
Initialize the project:
code
Bash
mkdir task-api
cd task-api
npm init -y
Install Dependencies:
code
Bash
npm install express
Install Development Dependencies:
code
Bash
npm install -D typescript ts-node @types/node @types/express
Initialize TypeScript configuration:
code
Bash
npx tsc --init
Create the file:
Save your code as index.ts.
🏃 Running the Server
To start the server in development mode, run:
code
Bash
npx ts-node index.ts
The server will start at: http://localhost:3000

