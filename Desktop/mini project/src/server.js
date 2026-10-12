require('dotenv').config();
require('./config/validateDatabaseConfig')();

const app = require('./app');
const { sequelize } = require('./models');

const port = Number(process.env.PORT || 3000);

async function start() {
  await sequelize.authenticate();
  app.listen(port, () => {
    console.log(`Pharmacy API listening on port ${port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start the pharmacy API:', error);
  process.exitCode = 1;
});
