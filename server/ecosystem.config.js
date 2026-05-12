// PM2 process config — used on EC2 / Digital Ocean / bare VPS
module.exports = {
  apps: [
    {
      name:         "oilintel-api",
      script:       "index.js",
      instances:    "max",      // one process per CPU core
      exec_mode:    "cluster",
      watch:        false,
      max_memory_restart: "512M",
      env_production: {
        NODE_ENV: "production",
        PORT:     4000,
      },
      error_file: "./logs/err.log",
      out_file:   "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
