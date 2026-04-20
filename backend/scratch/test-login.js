const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MongoMemoryServer } = require('mongodb-memory-server');

async function test() {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  const userSchema = new mongoose.Schema({
    email: String,
    password: { type: String, select: false }
  });

  userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });

  const User = mongoose.model('User', userSchema);

  const plainPassword = 'Password123';
  const email = 'test@example.com';

  await User.create({ email, password: plainPassword });
  console.log('User created');

  const user = await User.findOne({ email }).select('+password');
  console.log('User found:', !!user);

  const isMatch = await bcrypt.compare(plainPassword, user.password);
  console.log('Password match:', isMatch);

  process.exit(0);
}

test();
