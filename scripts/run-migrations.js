#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Migration Runner for Öz Mevsim Project
 * Runs all SQL migration files in sequence
 */

const MIGRATIONS_DIR = path.join(__dirname, '../migrations');
const SCHEMA_FILE = path.join(__dirname, '../schema.sql');

async function runMigrations() {
  console.log('🚀 Starting database migrations...');
  
  try {
    // Check if migrations directory exists
    if (!fs.existsSync(MIGRATIONS_DIR)) {
      console.error('❌ Migrations directory not found:', MIGRATIONS_DIR);
      process.exit(1);
    }

    // Get all migration files
    const migrationFiles = fs.readdirSync(MIGRATIONS_DIR)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort to ensure proper order

    console.log(`📁 Found ${migrationFiles.length} migration files:`);
    migrationFiles.forEach(file => console.log(`   - ${file}`));

    // Read and combine all migrations
    let combinedSQL = '';
    
    // First, add the existing schema
    if (fs.existsSync(SCHEMA_FILE)) {
      console.log('📄 Adding existing schema...');
      combinedSQL += fs.readFileSync(SCHEMA_FILE, 'utf8') + '\n\n';
    }

    // Then add all migrations
    for (const file of migrationFiles) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      console.log(`📝 Processing migration: ${file}`);
      combinedSQL += `-- Migration: ${file}\n`;
      combinedSQL += sql + '\n\n';
    }

    // Write combined migration file
    const outputFile = path.join(__dirname, '../combined-migrations.sql');
    fs.writeFileSync(outputFile, combinedSQL);
    
    console.log('✅ Combined migrations written to:', outputFile);
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Run the combined SQL file in your database');
    console.log('2. Or use Cloudflare D1 CLI:');
    console.log('   npx wrangler d1 execute ozmevsim-d1 --file combined-migrations.sql');
    console.log('');
    console.log('🎯 Migration Summary:');
    console.log('   - Enhanced site_settings table with grouping');
    console.log('   - Added dynamic_pages and content_blocks tables');
    console.log('   - Created menu_locations and menu_items tables');
    console.log('   - Enhanced media library with folders and collections');
    console.log('   - Added comprehensive indexing for performance');

  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations }; 