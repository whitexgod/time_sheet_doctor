# Timesheet Doctor

Timesheet Doctor is a project designed to streamline the process of filling out time details and exporting them to an Excel file.

## Features
- **Timesheet Management**: Users can input and manage their timesheet data.
- **Export to Excel**: Generate timesheet reports in Excel format using ExcelJS.
- **Login System**: Secure access with environment variable-based authentication.

## Technologies Used
- **Node.js**: Backend framework for server-side scripting.
- **Express.js**: Web framework for building the server.
- **TypeScript**: Strongly typed JavaScript for better development experience.
- **Mongoose**: MongoDB object modeling tool to interact with the database.
- **ExcelJS**: Used for generating Excel reports.
- **Date-fns-tz**: Time zone-aware date functions.
- **EJS**: Template engine for rendering views.

## Prerequisites
To run this project, you will need:
- Node.js
- MongoDB
- Amazon Linux (for deployment if using EC2)
- Environment variables for authentication (login credentials)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/timesheet_doctor.git
   cd timesheet_doctor
