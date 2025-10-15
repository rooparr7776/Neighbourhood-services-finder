const User = require('../models/User');
const Provider = require('../models/Provider');

// Update User Badge
async function updateUserBadge(userId) {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error('User not found');
    }

    user.servicesUsed += 1; // Increment services used

    // Update the badge based on services used
    if (user.servicesUsed > 20) {
        user.badge = 'gold';
    } else if (user.servicesUsed > 5) {
        user.badge = 'silver';
    } else {
        user.badge = 'none';
    }

    await user.save();
}

// Update Provider Badge
async function updateProviderBadge(providerId) {
    const provider = await Provider.findById(providerId);

    if (!provider) {
        throw new Error('Provider not found');
    }

    provider.servicesProvided += 1; // Increment services provided

    // Update the badge based on services provided
    if (provider.servicesProvided > 20) {
        provider.badge = 'gold';
    } else if (provider.servicesProvided > 5) {
        provider.badge = 'silver';
    } else {
        provider.badge = 'none';
    }

    await provider.save();
}

module.exports = { updateUserBadge, updateProviderBadge };
