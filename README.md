# Task Management REST API

## Description

This is a lightweight RESTful API built using Node.js, Express, and TypeScript. It allows users to manage a "To-Do" list by performing CRUD (Create, Read, Update, Delete) operations on tasks stored in an in-memory array. This project demonstrates basic API routing, TypeScript interface implementation, and request handling in a backend environment.

## Requirements
To run this project, you need the following installed on your local machine:

- **Node.js**: Version 14.x or higher
- **npm**: (Node Package Manager)
- **TypeScript**: Installed globally or as a dev dependency
- **Terminal/Command Line**: To execute commands and test endpoints

## Installation
Follow these steps to get your development environment running:

1. **Clone or create the project folder:**
   ```
   bash
   mkdir task_manager
   cd task_manager
   ```
1. Initialize the project:
`code`
`Bash`
`npm init -y`
2. Install Dependencies:
`code`
`Bash`
`npm install express`
`npm install -D typescript ts-node @types/node @types/express`
3. Initialize TypeScript:
`code`
`Bash`
`npx tsx --init`
## Usage
### Start the Server:
**Run the following command in your terminal:**
`code`
`Bash`
`npx tsx index.ts`

The server will start at [http://localhost:3000]
## API Endpoints:

GET /tasks - Retrieve all tasks.

GET /tasks/:id - Retrieve a single task by its ID.

POST /tasks - Add a new task (Body: {"title": "string"}).

PUT /tasks/:id - Update a task's status (Body: {"completed": boolean}).

DELETE /tasks/:id - Remove a task by ID.

## Contributing
* Contributions are welcome! To contribute:
* Fork the Project.
* Create your Feature Branch (git checkout -b feature/AmazingFeature).
* Commit your Changes (git commit -m 'Add some AmazingFeature').
* Push to the Branch (git push origin feature/AmazingFeature).
* Open a Pull Request.
## Authors & Acknowledgement
1. Vincent Ochieng- Developer - [https://github.com/VIN9CENT]
- Thanks to the Express.js and TypeScript documentation for guidance.
- Huge thanks to my technical instructor, Silvanos Eric
## License
This project is licensed under the MIT License - see the LICENSE file for details.
## Deployment
- Remote Repository: [https://github.com/VIN9CENT/tasks]
- Repository Status: Public
- Collaborator Invitations: Sent to evaluator.
