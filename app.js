const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const mongoose = require('mongoose');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const AppError = require('./AppError');

mongoose
  .connect('mongodb://127.0.0.1:27017/yelpCamp')
  .then(() => {
    // brew services start mongodb-community to start mongoDB
    // brew services stop mongodb-community to stop mongoDB
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB');
    console.log(err);
  });
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // For x-www-form-urlencoded
app.use(express.json());
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('_method'));
app.use(morgan('dev')); // loggs information about the request to the console

const varifyPassword = (req, res, next) => {
  // middleware to verify the password, DO NOT USE IN PRODUCTION
  const { password } = req.query;
  if (password === '123456') {
    next();
  } else {
    res.send('Invalid password');
  }
};

app.get('/', (req, res) => {
  // Home route
  res.render('home');
});

app.get('/campgrounds', async (req, res) => {
  // Campgrounds index route
  const campgrounds = await Campground.find({})
    .then((campgrounds) => {
      res.render('campgrounds/index', { campgrounds });
    })
    .catch((err) => {
      console.log(err);
      res.send('Error finding campgrounds at route GET /campgrounds');
    });
});

app.get('/campgrounds/new', (req, res) => {
  // Campgrounds new route
  res.render('campgrounds/new');
});

app.get('/campgrounds/:id/edit', async (req, res) => {
  // Campgrounds edit route
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .then((campground) => {
      res.render('campgrounds/edit', { campground });
    })
    .catch((err) => {
      console.log(err);
      res.send('Error finding campground at route GET /campgrounds/:id/edit');
    });
});

app.delete('/campgrounds/:id', async (req, res) => {
  // Campgrounds delete route
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.status(200).send('Campground deleted successfully');
});

app.put('/campgrounds/:id', async (req, res) => {
  // Campgrounds update route
  const { id } = req.params;
  await Campground.findByIdAndUpdate(id, req.body.campground, {
    new: true,
    runValidators: true,
  })
    .then(() => {
      res.redirect(`/campgrounds/${id}`);
    })
    .catch((err) => {
      console.log(err);
      res.send('Error updating campground at route PUT /campgrounds/:id');
    });
});

app.post('/campgrounds', async (req, res) => {
  // Campgrounds create route

  const { title, price, description, location, image } = req.body.campground;

  const newCampground = new Campground({
    title,
    price,
    description,
    location,
    image,
  });
  await newCampground
    .save()
    .then((newCampground) => {
      res.redirect(`/campgrounds/${newCampground._id}`);
    })
    .catch((err) => {
      console.log(err);
      res.send('Error adding campground at route POST /campgrounds');
    });
});

app.get('/campgrounds/:id', async (req, res) => {
  // Campgrounds show route
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .then((campground) => {
      res.render('campgrounds/show', { campground });
    })
    .catch((err) => {
      console.log(err);
      res.send('Error finding campground at route GET /campgrounds/:id');
    });
});

app.get('/secret', varifyPassword, (req, res) => {
  // Secret route
  res.send('This is a secret page');
});

app.use((req, res, next) => {
  res.status(404).send('Page not found');
});

app.listen(3000, () => {
  console.log('YelpCamp Server is running on port 3000');
});
