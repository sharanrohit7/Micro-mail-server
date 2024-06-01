const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const app = express();
const port = 3000;

const csvFilePath = path.join(__dirname, 'data.csv');

const readCSV = () => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(csvFilePath)
            .pipe(csv({ headers: false }))  // No headers in the CSV file
            .on('data', (data) => results.push(Object.values(data)[0]))  // Get the first value (email)
            .on('end', () => {
                resolve(results);
            })
            .on('error', (err) => reject(err));
    });
};

const performActionOnEmail = (email) => {
    // Your logic here (e.g., sending an email, validating, etc.)
    console.log(`Performing action on: ${email}`);
};

const processEmails = (emails, interval) => {
    let index = 0;

    const intervalId = setInterval(() => {
        if (index < emails.length) {
            performActionOnEmail(emails[index]);  // Directly use the email from the list
            index++;
        } else {
            clearInterval(intervalId);
        }
    }, interval);
};

const main = async () => {
    try {
        const emails = await readCSV();
        processEmails(emails, 1000); // Set interval to 120000 milliseconds (2 minutes)
    } catch (error) {
        console.error('Error:', error);
    }
};

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    main(); // Start processing emails when the server starts
});
