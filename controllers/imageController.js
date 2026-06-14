const image = require("../models/image");
const gallery = require("../models/gallery");
const user = require("../models/user");
const asyncHandler = require("express-async-handler");
const formidable = require("formidable");
const path = require("path");
const comment = require("../models/comment");

exports.getImageList = asyncHandler(async (req, res, next) => {
  const allImages = await image.find({}).populate("gallery").exec();
  res.render("image_list", { title: "Lista wszystkich zdjęć:",
     image_list: allImages,
     loggedUser: req.loggedUser 
  });
});

exports.getImageAdd = asyncHandler(async (req, res, next) => {
  const isAdmin = req.loggedUser === 'admin';
  let available_galleries;

  if (isAdmin) {
    available_galleries = await gallery.find().sort({ name: 1 }).exec();
  } else {
    const loggedUserDoc = await user.findOne({ username: req.loggedUser }).exec();
    available_galleries = await gallery.find({ owner: loggedUserDoc._id }).sort({ name: 1 }).exec();
  }

  res.render("image_form", {
    title: "Dodaj zdjęcie:",
    galleries: available_galleries,
    loggedUser: req.loggedUser
  });
});

exports.postImageAdd = asyncHandler(async (req, res, next) => {
  const form = new formidable.IncomingForm({
    uploadDir: path.join(__dirname, "../public/images"), 
    multiples: false,
    keepExtensions: true 
  });

  form.parse(req, async (err, fields, files) => {
    
    const isAdmin = req.loggedUser === 'admin';
    let available_galleries;

    if (isAdmin) {
      available_galleries = await gallery.find().sort({ name: 1 }).exec();
    } else {
      const loggedUserDoc = await user.findOne({ username: req.loggedUser }).exec();
      available_galleries = await gallery.find({ owner: loggedUserDoc._id }).sort({ name: 1 }).exec();
    }

    if (err) {
      return res.render("image_form", { 
        title: "Dodaj zdjęcie:", 
        galleries: available_galleries,
        messages: ["Błąd podczas przesyłania pliku!"], 
        loggedUser: req.loggedUser 
      });
    }

    try {
      const name = Array.isArray(fields.i_name) ? fields.i_name[0] : fields.i_name;
      const desc = Array.isArray(fields.i_description) ? fields.i_description[0] : fields.i_description;
      const galId = Array.isArray(fields.i_gallery) ? fields.i_gallery[0] : fields.i_gallery;
      
      const uploadedFile = Array.isArray(files.i_path) ? files.i_path[0] : files.i_path;
      const filename = path.basename(uploadedFile.filepath || uploadedFile.path);

      const newImage = new image({
        name: name,
        description: desc,
        path: filename, 
        gallery: galId
      });

      await newImage.save();
      
      // 3. Sukces: Renderujemy formularz z powrotem, podając komunikat na dole
      res.render("image_form", { 
        title: "Dodaj zdjęcie:", 
        galleries: available_galleries,
        messages: [`Zdjęcie "${newImage.name}" zostało dodane!`], 
        loggedUser: req.loggedUser 
      });

    } catch (e) {
      console.log(e);
      // 4. Błąd bazy danych
      res.render("image_form", { 
        title: "Dodaj zdjęcie:", 
        galleries: available_galleries,
        messages: ["Błąd bazy danych!"], 
        loggedUser: req.loggedUser 
      });
    }
  });
});
exports.getImageUpdate = asyncHandler(async (req, res, next) => {
  let all_galleries;
  if (req.loggedUser === "admin") {
    all_galleries = await gallery.find({}).sort({ name: 1 }).exec();
  } else {
    const loggedUserDoc = await user.findOne({ username: req.loggedUser }).exec();
    all_galleries = await gallery.find({ owner: loggedUserDoc._id }).exec();
  }

  const imageObj = await image.findOne({ _id: req.query.image_id }).exec();

  res.render("image_update", {
    title: "Edytuj zdjęcie:",
    image: imageObj,
    galleries: all_galleries,
    loggedUser: req.loggedUser
  });
});

exports.postImageUpdate = asyncHandler(async (req, res, next) => {
  const imageObj = await image.findById(req.query.image_id).populate("gallery").exec();
  if (!imageObj) return res.redirect("/galleries/gallery_browse");

  const isAdmin = req.loggedUser === "admin";
  const loggedUserDoc = await user.findOne({ username: req.loggedUser }).exec();

  if (isAdmin || imageObj.gallery.owner.toString() === loggedUserDoc._id.toString()) {
    const update = {
      name: req.body.i_name,
      description: req.body.i_description,
      gallery: req.body.i_gallery,
    };
    await image.findByIdAndUpdate(req.query.image_id, update);
    res.redirect("/galleries/gallery_browse");
  } else {
    res.render("info", { title: "Błąd", messages: ["Nie masz uprawnień do edycji tego zdjęcia!"], loggedUser: req.loggedUser });
  }
});

exports.getImageDelete = asyncHandler(async (req, res, next) => {
  const imageObj = await image.findById(req.query.image_id).populate("gallery").exec();
  
  if (!imageObj) {
    return res.redirect("back"); 
  }

  const isAdmin = req.loggedUser === "admin";
  const loggedUserDoc = await user.findOne({ username: req.loggedUser }).exec();

  if (isAdmin || (imageObj.gallery.owner && imageObj.gallery.owner.toString() === loggedUserDoc._id.toString())) {
    
    await image.findByIdAndDelete(req.query.image_id);
    
    res.redirect("back");
    
  } else {
    res.render("info", { 
      title: "Błąd", 
      messages: ["Nie masz uprawnień do usunięcia tego zdjęcia!"], 
      loggedUser: req.loggedUser 
    });
  }
});
exports.getImageShow = asyncHandler(async (req, res, next) => {
  const imageObj = await image.findById(req.query.image_id).populate("gallery").exec();
  
  const imageComments = await comment.find({ image: req.query.image_id })
    .populate("user")
    .sort({ created_at: -1 }) 
    .exec();

  res.render("image_show", {
    title: imageObj.name,
    image: imageObj,
    comments: imageComments,
    loggedUser: req.loggedUser
  });
});

exports.postImageComment = asyncHandler(async (req, res, next) => {
  const loggedUserDoc = await user.findOne({ username: req.loggedUser }).exec();

  const newComment = new comment({
    text: req.body.c_text,
    image: req.query.image_id,
    user: loggedUserDoc._id,
    created_at: new Date()
  });

  await newComment.save();
  res.redirect("/images/image_show?image_id=" + req.query.image_id);
});