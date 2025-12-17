const Favorite = require('../models/Favorite');

exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { destinationId } = req.body;

    if (!destinationId) {
      return res.status(400).json({ message: 'Destination ID is required' });
    }

    const existing = await Favorite.findOne({ user: userId, destination: destinationId });
    if (existing) {
      return res.status(400).json({ message: 'Already in favorites' });
    }

    const favorite = await Favorite.create({
      user: userId,
      destination: destinationId,
    });

    return res.status(201).json(favorite);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const favorites = await Favorite.find({ user: userId }).populate('destination');
    return res.json(favorites);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const favorite = await Favorite.findOneAndDelete({ _id: id, user: userId });
    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    return res.json({ message: 'Favorite removed' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};


