const bcrypt = require('bcryptjs');

async function createPasswordHash() {
  // Get password and email from command line args, or use defaults
  const password = process.argv[2] || 'password123';
  const email = process.argv[3] || 'user@example.com';
  
  console.log('🔍 Creating hash for password:', password);
  console.log('🔍 For email:', email);
  
  // Use the same method as your userModel.create function
  const hash = await bcrypt.hash(password, 12);
  console.log('✅ Generated hash:', hash);
  console.log('✅ Hash length:', hash.length);
  
  // Test the hash immediately
  const isValid = await bcrypt.compare(password, hash);
  console.log('✅ Verification test:', isValid ? '✅ PASS' : '❌ FAIL');
  
  console.log('\n--- SQL Commands ---');
  console.log('-- Update existing user:');
  console.log(`UPDATE users SET password_hash = '${hash}' WHERE email = '${email}';`);
  console.log('\n-- Or create new user:');
  console.log(`INSERT INTO users (name, email, password_hash) VALUES ('User Name', '${email}', '${hash}');`);
  console.log('\n-- Verify user:');
  console.log(`SELECT email, name, LEFT(password_hash, 20) as hash_preview FROM users WHERE email = '${email}';`);
  console.log('--- End SQL ---\n');
  
  console.log('💡 Usage: node create-password-hash.js [password] [email]');
}

createPasswordHash().catch(console.error);