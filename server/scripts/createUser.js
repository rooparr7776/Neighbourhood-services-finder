const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Assuming you have a User model defined similarly to the Provider model

mongoose.connect('mongodb://localhost:27017/neighbourhood', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const newUsers = [
    {
        name: 'Sundar P',
        email: 'sundar.p@gmail.com',
        password: 'Sundar@123',
        role: 'user',
        photo: 'user21.png',
        location: {
            type: 'Point',
            coordinates: [77.3125, 13.0276], // Longitude, Latitude
        },
    },
    {
        name: 'Keerthi R',
        email: 'keerthi.r@gmail.com',
        password: 'Keerthi@123',
        role: 'user',
        photo: 'user22.png',
        location: {
            type: 'Point',
            coordinates: [77.2981, 13.0399], // Longitude, Latitude
        },
    },
    {
        name: 'Rajesh V',
        email: 'rajesh.v@gmail.com',
        password: 'Rajesh@123',
        role: 'user',
        photo: 'user23.png',
        location: {
            type: 'Point',
            coordinates: [77.3259, 13.0536], // Longitude, Latitude
        },
    },
    {
        name: 'Bhuvana M',
        email: 'bhuvana.m@gmail.com',
        password: 'Bhuvana@123',
        role: 'user',
        photo: 'user24.png',
        location: {
            type: 'Point',
            coordinates: [77.3432, 13.0701], // Longitude, Latitude
        },
    },
    {
        name: 'Karthik S',
        email: 'karthik.s@gmail.com',
        password: 'Karthik@123',
        role: 'user',
        photo: 'user25.png',
        location: {
            type: 'Point',
            coordinates: [77.3378, 13.0428], // Longitude, Latitude
        },
    },
    {
        name: 'Pradeep R',
        email: 'pradeep.r@gmail.com',
        password: 'Pradeep@123',
        role: 'user',
        photo: 'user26.png',
        location: {
            type: 'Point',
            coordinates: [77.3098, 13.0284], // Longitude, Latitude
        },
    },
    {
        name: 'Vidya T',
        email: 'vidya.t@gmail.com',
        password: 'Vidya@123',
        role: 'user',
        photo: 'user27.png',
        location: {
            type: 'Point',
            coordinates: [77.3243, 13.0527], // Longitude, Latitude
        },
    },
    {
        name: 'Gokul P',
        email: 'gokul.p@gmail.com',
        password: 'Gokul@123',
        role: 'user',
        photo: 'user28.png',
        location: {
            type: 'Point',
            coordinates: [77.3227, 13.0563], // Longitude, Latitude
        },
    },
    {
        name: 'Latha N',
        email: 'latha.n@gmail.com',
        password: 'Latha@123',
        role: 'user',
        photo: 'user29.png',
        location: {
            type: 'Point',
            coordinates: [77.3182, 13.0407], // Longitude, Latitude
        },
    },
    {
        name: 'Prakash R',
        email: 'prakash.r@gmail.com',
        password: 'Prakash@123',
        role: 'user',
        photo: 'user30.png',
        location: {
            type: 'Point',
            coordinates: [77.3404, 13.0610], // Longitude, Latitude
        },
    },
];

async function createNewUsers() {
    try {
        for (const userData of newUsers) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = new User({ ...userData, password: hashedPassword });
            await user.save();
            console.log(`✅ Created user: ${user.name} (${user.email})`);
        }
        mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error creating users:', err);
        mongoose.disconnect();
    }
}

createNewUsers();
