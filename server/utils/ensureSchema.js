// sequelize.sync() creates missing TABLES but never adds new COLUMNS to existing ones. This runs at
// startup and adds any column that a model defines but the database lacks (it only ever ADDS —
// nothing is altered or dropped), so deploying new model fields can no longer break a live database.

// One-off data fix-ups that must happen exactly when a column is first created.
const AFTER_ADD = {
  // Accounts that already exist must not be locked out by the new email-verification rule.
  'users.emailVerified': async (sequelize) => { await sequelize.query('UPDATE users SET emailVerified = 1'); },
  // Seed the public contact email once; the admin can change or clear it afterwards.
  'site_settings.contactEmail': async (sequelize) => {
    await sequelize.query("UPDATE site_settings SET contactEmail = 'info@iipajobs.co.in' WHERE contactEmail IS NULL");
  },
};

async function ensureSchema(sequelize) {
  const qi = sequelize.getQueryInterface();
  const added = [];
  for (const model of Object.values(sequelize.models)) {
    const table = model.getTableName();
    const existing = await qi.describeTable(table);
    for (const [name, attr] of Object.entries(model.rawAttributes)) {
      if (existing[name] || attr.field && existing[attr.field]) continue;
      await qi.addColumn(table, name, attr);
      added.push(`${table}.${name}`);
      if (AFTER_ADD[`${table}.${name}`]) await AFTER_ADD[`${table}.${name}`](sequelize);
    }
  }
  if (added.length) console.log('Schema: added columns ->', added.join(', '));
  else console.log('Schema: up to date.');
  return added;
}

module.exports = ensureSchema;
