const bcrypt = require('bcryptjs');
console.log('bcrypt keys:', Object.keys(bcrypt));
bcrypt.genSalt(10).then(salt => {
  console.log('salt:', salt);
  return bcrypt.hash('password', salt);
}).then(hash => {
  console.log('hash:', hash);
  return bcrypt.compare('password', hash);
}).then(match => {
  console.log('match:', match);
}).catch(err => {
  console.error('error:', err);
});
