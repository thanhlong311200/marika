module.exports = {
  apps: [
    {
      name: "Marikaday_app",
      script: "./server.js",
      cwd: "/var/www/marikaday_app/",
      exec_mode: "cluster",
      env_stg: {
        NODE_ENV: "stg",
        PORT: 4000
      },
      env_prod: {
        NODE_ENV: "production",
        PORT: 4000
      }
    },
    {
      name: 'CRON_ACAST',
      script: "./config/CronAcast.js",
      cwd: "/var/www/marikaday_app/",
      exec_mode: 'cluster',
    }
  ]
}
