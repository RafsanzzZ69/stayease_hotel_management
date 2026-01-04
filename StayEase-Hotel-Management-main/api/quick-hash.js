// quick-hash.js
import bcrypt from 'bcryptjs';

const password = "123456";  // or whatever password you want

bcrypt.hash(password, 10).then(hash => {
  console.log("Hashed password:", hash);
});