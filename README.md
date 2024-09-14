Timesheet Doctor
Timesheet Doctor is a project designed to streamline the process of filling out time details and exporting them to an Excel file.

Features
Timesheet Management: Users can input and manage their timesheet data.
Export to Excel: Generate timesheet reports in Excel format using ExcelJS.
Login System: Secure access with environment variable-based authentication.
Technologies Used
Node.js: Backend framework for server-side scripting.
Express.js: Web framework for building the server.
TypeScript: Strongly typed JavaScript for better development experience.
Mongoose: MongoDB object modeling tool to interact with the database.
ExcelJS: Used for generating Excel reports.
Date-fns-tz: Time zone-aware date functions.
EJS: Template engine for rendering views.
Prerequisites
To run this project, you will need:

Node.js
MongoDB
Amazon Linux (for deployment if using EC2)
Environment variables for authentication (login credentials)
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/yourusername/timesheet_doctor.git
cd timesheet_doctor
Install dependencies:

bash
Copy code
npm install
Set up your .env file with the following variables:

makefile
Copy code
EMAIL=your-email@example.com
PASSWORD=your-password
Run the development server:

bash
Copy code
npm run dev
Scripts
dev: Runs the development server using tsx with hot reloading.
build: Compiles the TypeScript files to JavaScript.
start: Runs the production build of the server.
Usage
Start the server using:

bash
Copy code
npm run dev
Fill in the timesheet details via the web interface.

Export timesheet data as an Excel file.

License
This project is licensed under the ISC License.

Contributions
Feel free to submit issues or pull requests to contribute to the project.

