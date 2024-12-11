const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Account = require('../models/Account'); // Adjust schema path

// Establish database connection
mongoose.connect('mongodb://localhost:27017/yourdb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database connected successfully!');
        runAddAccount();
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });

// Function to convert image file to Base64
const convertImageToBase64 = (imagePath) => {
    const absoluteImagePath = path.resolve(__dirname, imagePath); // Resolving the absolute path
    console.log('Resolving image path:', absoluteImagePath); // Debugging log
    const imageBuffer = fs.readFileSync(absoluteImagePath);
    return imageBuffer.toString('base64');
};

// Function to add accounts to the database
const runAddAccount = async () => {
    try {
        console.log('Starting to add accounts with images...');
        
        const accountsData = [
            {
                accountNumber: '101',
                userName: 'User1',
                email: 'user1@example.com',
                image: '../uploads/monisha_sign.jpg', // Example local image path
            },
            {
                accountNumber: '102',
                userName: 'User2',
                email: 'user2@example.com',
                image: '../uploads/vajra_sign.jpg', // Example local image path
            },
            {
                accountNumber: '103',
                userName: 'User2',
                email: 'user2@example.com',
                image: '../uploads/satvik_sign.jpg', // Example local image path
            },
            // Add more accounts as needed
        ];

        const accounts = accountsData.map((account) => {
            const base64Image = convertImageToBase64(account.image);
            return {
                accountNumber: account.accountNumber,
                userName: account.userName,
                email: account.email,
                image: base64Image,
            };
        });

        // Insert accounts into the database
        const result = await Account.insertMany(accounts);
        console.log('Accounts added successfully:', result);
    } catch (error) {
        console.error('Error while adding accounts:', error);
    } finally {
        mongoose.connection.close(); // Close the database connection
        console.log('Database connection closed.');
    }
};
