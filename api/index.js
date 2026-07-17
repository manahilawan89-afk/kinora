const { createApp } = require("../backend/src/app");
const { seedDatabase } = require("../backend/src/seed");

const app = createApp();

let seeding;
function ensureSeeded() {
  if (!seeding) {
    seeding = seedDatabase().catch((err) => {
      console.error("Seed error:", err);
    });
  }
  return seeding;
}

module.exports = async (req, res) => {
  await ensureSeeded();
  return app(req, res);
};
