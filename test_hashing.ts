import mongoose from 'mongoose';
import { User } from './src/models/userModels';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function testHashing() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aakt';
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'password123';

  // 1. Create User
  console.log('Creating user...');
  const user = await User.create({
    fullName: 'Test User',
    email: testEmail,
    password: testPassword
  });

  console.log('User created. Password in DB:', user.password);
  
  if (user.password === testPassword) {
    console.error('FAIL: Password was not hashed!');
  } else {
    console.log('SUCCESS: Password was hashed.');
  }

  // 2. Test bcrypt compare
  const isMatch = await bcrypt.compare(testPassword, user.password!);
  if (isMatch) {
    console.log('SUCCESS: compare worked for correct password.');
  } else {
    console.error('FAIL: compare failed for correct password.');
  }

  // 3. Test wrong password
  const isMatchWrong = await bcrypt.compare('wrongpassword', user.password!);
  if (!isMatchWrong) {
    console.log('SUCCESS: bcrypt.compare correctly failed for wrong password.');
  } else {
    console.error('FAIL: bcrypt.compare succeeded for wrong password.');
  }

  // Cleanup
  await User.deleteOne({ _id: user._id });
  console.log('Test user deleted.');

  await mongoose.disconnect();
}

testHashing().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
