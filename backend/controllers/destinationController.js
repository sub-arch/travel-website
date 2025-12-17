const Destination = require('../models/Destination');

exports.getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find({});
    return res.json(destinations);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createDestination = async (req, res) => {
  try {
    const { name, country, description, latitude, longitude } = req.body;

    if (!name || !country || latitude == null || longitude == null) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const destination = await Destination.create({
      name,
      country,
      description,
      latitude,
      longitude,
    });

    return res.status(201).json(destination);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};


