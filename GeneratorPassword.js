const {hashPass} = require("./utils/Password");
(async () => {
  const hashPassword = await hashPass('admin');
  console.log(hashPassword)
})()
