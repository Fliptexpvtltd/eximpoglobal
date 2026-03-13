import { query } from '../config/database.js';
import * as migration_008 from './008_add_payment_tables.js';
import * as migration_009 from './009_add_display_order_to_products.js';

const migrations = [
  { name: '008_add_payment_tables', module: migration_008 },
  { name: '009_add_display_order_to_products', module: migration_009 },
];

async function runMigrations() {
  try {
    // Create migrations tracking table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS migrations_log (
        id SERIAL PRIMARY KEY,
        migration_name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('\n📦 Running migrations...\n');

    for (const migration of migrations) {
      // Check if migration has already run
      const result = await query(
        'SELECT * FROM migrations_log WHERE migration_name = $1',
        [migration.name]
      );

      if (result.rows.length > 0) {
        console.log(`⏭️  Skipped: ${migration.name} (already executed)`);
        continue;
      }

      // Run the migration
      if (migration.module.up) {
        try {
          await migration.module.up();
          
          // Log the migration
          await query(
            'INSERT INTO migrations_log (migration_name) VALUES ($1)',
            [migration.name]
          );
          
          console.log(`✅ Completed: ${migration.name}`);
        } catch (error) {
          console.error(`❌ Failed: ${migration.name}`);
          console.error(error.message);
          process.exit(1);
        }
      }
    }

    console.log('\n✅ All migrations completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration runner error:', error);
    process.exit(1);
  }
}

runMigrations();
