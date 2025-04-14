const mongoose = require('mongoose');
const Provider = require('../models/Provider'); // ✅ fixed path

const MONGO_URI = 'mongodb://127.0.0.1:27017/neighbourhood'; // 🔁 use your DB name

const providers = [
    {
        name: 'Ravi Carpenter',
        email: 'carpenter1@test.com',
        password: '$2b$10$e7DL0C0iK9d/5nkiC4czfuIqkaN49B1V5UgM88Ug9dbpRbMDRYdzm', // carp1234
        category: 'Carpenter',
        availableDates: ['2025-04-15', '2025-04-17', '2025-04-20'],
        avg_rating: 4.1,
        role: 'provider',
        price: 450,
    },
    {
        name: 'Neha Cleaner',
        email: 'cleaner1@test.com',
        password: '$2b$10$Ez6Rp8nKDmWlQ5MxUpMF2uH0B3hIbWmdN9ErIqBTEQ8F7JZ23I7UO', // clean1234
        category: 'Cleaner',
        availableDates: ['2025-04-14', '2025-04-16', '2025-04-18'],
        avg_rating: 4.6,
        role: 'provider',
        price: 300,
    },
    {
        name: 'Amit Painter',
        email: 'painter1@test.com',
        password: '$2b$10$K0P7/yC3BB1twBcnXLu9FOanRjbf.zCLaoyuj.pTxxHBCe2IvdMkO', // paint1234
        category: 'Painter',
        availableDates: ['2025-04-19', '2025-04-21', '2025-04-22'],
        avg_rating: 4.3,
        role: 'provider',
        price: 550,
    }
];

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('🟢 Connected to MongoDB');

        await Provider.insertMany(providers);
        console.log('✅ Providers inserted successfully');

        mongoose.disconnect();
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
    });
