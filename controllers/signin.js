const handleSignIn = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("error submiting form");
  }
  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      return isValid
        ? db
            .select("*")
            .from("users")
            .where("email", "=", email)
            .then((user) => {
              res
                .json(user[0])
                .catch((err) => res.status(400).json("unable to get user"));
            })
        : res.status(400).json("can`t get credentials");
    })
    .catch((err) => res.status(400).json("wrong credentials"));
};
module.exports = {
  handleSignIn: handleSignIn,
};