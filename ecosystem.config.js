module.exports = {
    apps: [
      {
        name: 'timesheet_docter',
        script: 'dist/server.js',
        instances: 1, // Number of instances to run (can be adjusted based on your needs)
        autorestart: true,
        watch: false, // Set to true if you want PM2 to watch for file changes
        max_memory_restart: '1G', // Optional: Restart if memory exceeds 1GB
      },
    ],
  };
  