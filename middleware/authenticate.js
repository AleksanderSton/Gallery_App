const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    const token = req.cookies.mytoken;
    const decode = jwt.verify(token, 'kodSzyfrujacy');
    req.user = decode;
    req.loggedUser = req.user.username;
    next();
  } catch (err) {
    res.render("info", { 
  title: "Brak dostępu", 
  messages: ['Musisz się zalogować, aby zobaczyć tę stronę.'] 
});
  }
};

module.exports = authenticate;