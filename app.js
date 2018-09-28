var express			 		= require('express'),
	mongoose		 		= require('mongoose'),
	bodyParser		 		= require('body-parser'),
	passport		 		= require('passport'),
	LocalStrategy	 		= require('passport-local'),
	methodOverride			= require('method-override'),
	passportLocalMongoose	= require('passport-local-mongoose'),
	expressSession 			= require('express-session');
  center 					= require('./models/center.js'),
  Volunteer 					= require('./models/volunteer.js'),
  nodemailer = require("nodemailer"),
	flash					= require('connect-flash'),
User					= require('./models/user');
  require('dotenv/config');
// mongoose.connect("mongodb://localhost/notes", { useNewUrlParser: true });
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });

var app = express();
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret : "Shubham Puri",
	resave : false,
	saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser  = req.user;
	res.locals.error 		= req.flash("error");
	res.locals.success	    = req.flash("success");
	next();
});
//Nodemailer
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        //replace this with your email and its password and also give permission to by going to-> https://myaccount.google.com/lesssecureapps?pli=1
        user:process.env.YOUR_EMAIL,
        pass: process.env.YOUR_PASS
    }
});

app.get("/", function(req, res){
	Volunteer.find({},(err,volunteers)=>{

    res.render("index",{volunteers:volunteers});
  });

});

app.get("/volunteer/new", function(req, res){


    res.render("volunteers/new.ejs");


});
app.get("/volunteer/show", function(req, res){
	Volunteer.find({},(err,volunteers)=>{

    res.render("volunteers/show.ejs",{volunteers:volunteers});
  });

});

// Show all notes
app.get("/notes", isLoggedIn, function(req, res){
	User.findById(req.user._id).populate("notes").exec(function(err, user){
		if(err) {
			console.log(err)
		} else {
			res.render("index", {user : user});
		}
	});
});

// Show form to create a new note
app.get("/notes/new", function(req, res){
	res.render("new");
});

// Create a new note
app.post("/volunteer", function(req, res){
  var volunteer = new Volunteer ({
            fname : req.body.fname,
            email    : req.body.email,
            lname   : req.body.lname,
            address : req.body.address,
            number : req.body.number,
            center1:req.body.center1,
            center2:req.body.center2,
            center3:req.body.center3

          });
console.log(volunteer);
Volunteer.create(volunteer, function(err, newVolunteer){
		if(err) {
			req.flash("Error", "Something went wrong! Please try again.");
			console.log(err);
		} else {
		  newVolunteer.save();
			req.flash("success", "Successfully added a note!");
      var mailOptions = {
        to: newVolunteer.email,
        subject: "Added as volunteer",
        html: `Dear ${newVolunteer.fname},<br> Welcome to our app.`
    }
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
          console.log(error);

        } else {
            console.log("Message sent: " + response.message);
            res.redirect("/");

        }
    });

		}
	});
});

// Show edit form
app.get("/notes/:id/edit", function(req, res){
	Note.findById(req.params.id, function(err, foundNote){
		if(err) {
			req.flash("Error", "Sorry! your note could not be found!");
			console.log(err);
		} else {
			res.render("edit", {note : foundNote});
		}
	});
});

// Edit
app.put("/notes/:id/edit", function(req, res){
	var note = req.body.note;
	Note.findByIdAndUpdate(req.params.id, note, function(err, updatedNote){
		if(err) {
			req.flash("error", "Something went wrong! Please try again.");
			console.log(err);
		} else {
			req.flash("success", "Note updated successfully!");
			res.redirect("/notes");
		}
	});
});

// Delete note
app.delete("/notes/:id", function(req, res){
	Note.findByIdAndRemove(req.params.id, function(err){
		if(err) {
			req.flash("error", "Something went wrong! Please try again.");
			console.log(err);
		} else {
			req.flash("success", "Note deleted successfully!");
			res.redirect("/notes");
		}
	});
});

// Authentication routes

// Show registration form
app.get("/login", function(req, res){
	res.render("login");
});

// Register a new user
app.post("/register", function(req, res){
	var user = new User ({
						fname : req.body.fname,
						username    : req.body.email,
            lname: req.body.lname,
            password: String,
            address : req.body.address,
            profileImage : req.body.profileImage,
					});
	User.register(user, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			console.log(err.message);
			res.redirect("/");
		}
		else {
				passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to Notes " + user.username);
				res.redirect("/");
			});
		}
	});
});


// Login
app.post("/login", passport.authenticate("local",
	{
		successRedirect : "/",
		failureRedirect : "/login",
		failureFlash: true
	}), function(req, res){
});

// Logout
app.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Successfully logged out!");
	res.redirect("/");
});

// Middlewares

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please login to proceed!");
	res.redirect("/login");
}

// Listening to the server

app.listen(process.env.PORT || 8000, function(req, res){
	console.log("Server Started!");
});
