// server/scripts/createUsers.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

mongoose.connect('mongodb://localhost:27017/neighbourhood', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const users = [
    {
        name: 'Alice Smith',
        email: 'alice@test.com',
        password: 'Alice@123',
        role: 'user',
    },
    {
        name: 'Bob Johnson',
        email: 'bob@test.com',
        password: 'Bob@123',
        role: 'user',
    },
];

async function createUsers() {
    try {
        for (const userData of users) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = new User({ ...userData, password: hashedPassword });
            await user.save();
            console.log(`✅ Created user: ${user.email}`);
        }
        mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error creating users:', err);
        mongoose.disconnect();
    }
}

createUsers();
