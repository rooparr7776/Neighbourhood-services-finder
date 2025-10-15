const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Provider = require('../models/Provider');

mongoose.connect('mongodb://localhost:27017/neighbourhood', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const newProviders = [
    {
        name: 'Priya Babysitter',
        email: 'priya2@gmail.com',
        password: 'Priya@123',
        category: 'Babysitter',
        price: '320',
        photo: 'babysitter1.png',
        availableDates: ['2025-04-22', '2025-04-23'],
        location: {
            type: 'Point',
            coordinates: [77.3981, 11.3951],
        },
        avg_rating: 4.75,
        badge: 'gold',
    },
    {
        name: 'Ravi Plumber',
        email: 'ravi2@gmail.com',
        password: 'Ravi@123',
        category: 'Plumber',
        price: '350',
        photo: 'plumber1.png',
        availableDates: ['2025-04-21'],
        location: {
            type: 'Point',
            coordinates: [77.3420, 11.3870],
        },
        avg_rating: 4.6,
        badge: 'silver',
    },
    {
        name: 'Sneha Tutor',
        email: 'sneha2@gmail.com',
        password: 'Sneha@123',
        category: 'Tutor',
        price: '450',
        photo: 'tutor1.png',
        availableDates: ['2025-04-22'],
        location: {
            type: 'Point',
            coordinates: [77.3765, 11.3999],
        },
        avg_rating: 4.88,
        badge: 'gold',
    },
    {
        name: 'Vikram Driver',
        email: 'vikram2@gmail.com',
        password: 'Vikram@123',
        category: 'Driver',
        price: '430',
        photo: 'driver1.png',
        availableDates: ['2025-04-21', '2025-04-23'],
        location: {
            type: 'Point',
            coordinates: [77.4025, 11.3688],
        },
        avg_rating: 4.7,
        badge: 'silver',
    },
    {
        name: 'Neha Cleaner',
        email: 'neha2@gmail.com',
        password: 'Neha@123',
        category: 'Cleaner',
        price: '280',
        photo: 'maid1.png',
        availableDates: ['2025-04-22'],
        location: {
            type: 'Point',
            coordinates: [77.3452, 11.4100],
        },
        avg_rating: 4.55,
        badge: 'silver',
    },
    {
        name: 'Manoj Carpenter',
        email: 'manoj2@gmail.com',
        password: 'Manoj@123',
        category: 'Carpenter',
        price: '400',
        photo: 'carpenter1.png',
        availableDates: ['2025-04-21'],
        location: {
            type: 'Point',
            coordinates: [77.3655, 11.3821],
        },
        avg_rating: 4.78,
        badge: 'gold',
    },
    {
        name: 'Anjali Gardener',
        email: 'anjali2@gmail.com',
        password: 'Anjali@123',
        category: 'Gardener',
        price: '290',
        photo: 'gardener1.png',
        availableDates: ['2025-04-22', '2025-04-23'],
        location: {
            type: 'Point',
            coordinates: [77.3991, 11.3923],
        },
        avg_rating: 4.62,
        badge: 'silver',
    },
    {
        name: 'Suresh Pest Control',
        email: 'suresh2@gmail.com',
        password: 'Suresh@123',
        category: 'Pest Control',
        price: '470',
        photo: 'pestcontrol1.png',
        availableDates: ['2025-04-22'],
        location: {
            type: 'Point',
            coordinates: [77.3771, 11.3782],
        },
        avg_rating: 4.91,
        badge: 'gold',
    },
    {
        name: 'Deepa Nurse',
        email: 'deepa2@gmail.com',
        password: 'Deepa@123',
        category: 'Nurse',
        price: '500',
        photo: 'nurse1.png',
        availableDates: ['2025-04-21'],
        location: {
            type: 'Point',
            coordinates: [77.3655, 11.4011],
        },
        avg_rating: 4.87,
        badge: 'gold',
    },
    {
        name: 'Ramesh Watchman',
        email: 'ramesh2@gmail.com',
        password: 'Ramesh@123',
        category: 'Watchman',
        price: '330',
        photo: 'watchman1.png',
        availableDates: ['2025-04-21', '2025-04-22'],
        location: {
            type: 'Point',
            coordinates: [77.3866, 11.4200],
        },
        avg_rating: 4.59,
        badge: 'silver',
    },
];

async function createNewBadgeProviders() {
    try {
        for (const providerData of newProviders) {
            const hashedPassword = await bcrypt.hash(providerData.password, 10);
            const provider = new Provider({ ...providerData, password: hashedPassword });
            await provider.save();
            console.log(`✅ Created provider: ${provider.name} (${provider.email}) with badge: ${provider.badge}`);
        }
        mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error creating providers:', err);
        mongoose.disconnect();
    }
}

createNewBadgeProviders();
