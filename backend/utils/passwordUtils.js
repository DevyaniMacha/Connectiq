function generatePassword(length = 8) {
  const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  const allLetters = upperCase + lowerCase;

  let password = "";

  // Ensure at least one uppercase
  password += upperCase.charAt(Math.floor(Math.random() * upperCase.length));

  // Ensure at least one lowercase
  password += lowerCase.charAt(Math.floor(Math.random() * lowerCase.length));

  // Fill the remaining length
  for (let i = 2; i < length; i++) {
    password += allLetters.charAt(
      Math.floor(Math.random() * allLetters.length)
    );
  }

  // Shuffle the password so first 2 chars aren't predictable
  password = password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");

  return password;
}

module.exports = generatePassword;
