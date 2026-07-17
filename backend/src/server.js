const http = require("http");
const { createApp } = require("./app");
const { env } = require("./config/env");
const { seedDatabase } = require("./seed");

async function bootstrap() {
  await seedDatabase();

  const app = createApp();
  const server = http.createServer(app);

  server.listen(env.PORT, () => {
    console.log(`✅ API running at http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Bootstrap error:", err);
  process.exit(1);
});
