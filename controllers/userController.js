const user = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.userList = asyncHandler(async (req, res, next) => {
  const allUsers = await user.find({}).exec();
  res.render("user_list", { 
    title: "Wszyscy użytkownicy:", 
    user_list: allUsers,
    loggedUser: req.loggedUser 
  });
});

exports.getUserAdd = (req, res, next) => {
  res.render("user_form", { title: "Dodaj użytkownika" });
};

exports.postUserAdd = [
  body("first_name").trim().isLength({ min: 2 }).escape().withMessage("First name too short."),
  body("last_name").trim().isLength({ min: 2 }).escape().withMessage("Last name name too short."),
  body("username", "Username must contain at least 3 characters").trim().isLength({ min: 3 }).escape().isAlpha().withMessage("Username must be alphabet letters."),
  body("password", "Password too short!").isLength({ min: 8 }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const newuser = new user({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
    });

    if (!errors.isEmpty()) {
      let myMessages = [];
      errors.array().forEach(err => myMessages.push(err.msg));
      res.render("user_form", {
        title: "Dodaj użytkownika",
        user: newuser,
        messages: myMessages,
      });
      return;
    }

    const user_exists = await user.findOne({ username: req.body.username }).exec();

    if (user_exists) {
      res.render("user_form", {
        title: "Dodaj użytkownika",
        user: newuser,
        messages: [`Username "${newuser.username}" already exists!`]
      });
      return;
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10);
    newuser.password = passwordHash;


    await newuser.save();
    res.render("user_form", {
      title: "Dodaj użytkownika",
      user: {},
      messages: [`User "${newuser.username}" dodany`]
    });
  }),
];
exports.getUserLogin = (req, res, next) => {
  res.render("user_login_form", { title: "Zaloguj się" });
};

exports.postUserLogin = (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  user.findOne({ username })
    .then((foundUser) => {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if (err) {
            res.render("user_login_form", { title: "Zaloguj się", messages: ["Some bcrypt errors!"] });
            return;
          }
          if (result) {
            let token = jwt.sign({ username: foundUser.username }, 'kodSzyfrujacy', { expiresIn: '1h' });
            res.cookie('mytoken', token, { maxAge: 600000 });
            res.render('index', { title: 'Express', loggedUser: foundUser.username });
          } else {
            res.render("user_login_form", { title: "Zaloguj się", messages: ["Bad pass!"] });
          }
        })
      } else {
        res.render("user_login_form", { title: "Zaloguj się", messages: ["No user found!"] });
      }
    })
};

exports.getUserLogout = (req, res, next) => {
  res.clearCookie('mytoken');
  res.render('index', { title: 'Galeria Zdjęć', loggedUser: req.loggedUser });
};
exports.getUserDelete = asyncHandler(async (req, res, next) => {
  if (req.loggedUser === "admin") {
    const userGalleries = await gallery.countDocuments({ owner: req.query.user_id }).exec();
    
    if (userGalleries > 0) {
      return res.render("info", { 
        title: "Błąd", 
        messages: ["Nie można usunąć tego użytkownika! Posiada on przypisane galerie. Najpierw usuń jego galerie."], 
        loggedUser: req.loggedUser 
      });
    }

    await user.findByIdAndDelete(req.query.user_id);
    res.redirect("/users");
  } else {
    res.render("info", { title: "Odmowa dostępu", messages: ["Tylko admin może usuwać użytkowników."], loggedUser: req.loggedUser });
  }
});