const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

const StoreSchema = new mongoose.Schema({
    storeId: {
        type: String,
        required: [true, 'Please add a store ID'],
        unique: true,
        trim: true,
        maxLength: [10, 'Store ID must be less than 10 characters']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    location: {
        type: {
          type: String,
          enum: ['Point']
        },
        coordinates: {
          type: [Number], //Number array,
          index: '2dsphere' // supports queries that calculates geometries on an earth-like sphere
        },
        formattedAddress: String
      },
      createdAt: {
          type: Date,
          default: Date.now
      }
});

//Geocode & create Location
StoreSchema.pre('save', async function(next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress
  };

  // Do not save address
  this.address = undefined;
  next(); // since it is a piece of middleware
});

module.exports = mongoose.model('Store', StoreSchema);