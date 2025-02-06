/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://neondb_owner:npg_lOjPEw9Hv8pB@ep-shiny-bird-a8bxjheq-pooler.eastus2.azure.neon.tech/neondb?sslmode=require',
    }
  };