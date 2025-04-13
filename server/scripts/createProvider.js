// server/scripts/createProviders.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Provider = require('../models/Provider');

mongoose.connect('mongodb://localhost:27017/neighbourhood', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const providers = [
    {
        name: 'John Plumber',
        email: 'plumber1@test.com',
        password: 'Plumb@123',
        category: 'Plumber',
        availableDates: ['2025-04-14', '2025-04-15'],
        avg_rating: 4.2,
    },
    {
        name: 'Sally Electrician',
        email: 'electrician1@test.com',
        password: 'Electro@123',
        category: 'Electrician',
        availableDates: ['2025-04-14', '2025-04-16'],
        avg_rating: 4.8,
    },
];

async function createProviders() {
    try {
        for (const providerData of providers) {
            const hashedPassword = await bcrypt.hash(providerData.password, 10);
            const provider = new Provider({ ...providerData, password: hashedPassword });
            await provider.save();
            console.log(`✅ Created provider: ${provider.email}`);
        }
        mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error creating providers:', err);
        mongoose.disconnect();
    }
}

createProviders();
