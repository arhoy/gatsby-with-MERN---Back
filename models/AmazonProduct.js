// amazon products schema dictated by amzn web scraping
// added Slug field
// added pre save hook for cleaning data

const mongoose = require('mongoose');
const slugify = require('slugify');

const AmazonProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product Name is required'],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
  },
  price: {
    type: String,
    required: true,
  },
  priceValue: {
    type: Number,
  },
  image: {
    required: true,
    type: String,
  },
  ratting: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create bootcamp slug from the name
AmazonProductSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Rating field: create custom data before save. Get `ratting` field as numerical value
AmazonProductSchema.pre('save', function(next) {
  this.rating = this.ratting && this.ratting.substring(0, 3);
  next();
});

// Price Value field: create custom data before save. Get price as numerical value
// price is not always present in the crappy data.
AmazonProductSchema.pre('save', function(next) {
  this.priceValue = this.price && this.price.split('$')[1];
  next();
});

module.exports = mongoose.model('AmazonProducts', AmazonProductSchema);