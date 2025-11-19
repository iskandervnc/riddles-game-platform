'use strict';

const { User } = require('../objects/User')
const { db } = require('./db');
const crypto = require('crypto');



// Get user data FOR AUTHENTICATION
exports.getUser = (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM USER WHERE username = ?';
        db.get(sql, [username], (err, row) => {
            if (err) {
                reject(err);
            }
            else if (row === undefined) {
                resolve(false);
            }
            else {
                const user = { username: row.username, score: row.score };
                crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
                    if (err) reject(err);
                    if (!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword)) {
                        resolve(false);
                    }
                    else {
                        resolve(user);
                    }
                });
            }
        });
    });
};

// update user score
exports.updateScore = (gainedPoints, username) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE USER SET score = score + ? WHERE username = ?';
        db.run(sql, [gainedPoints, username], function (err) {
            if (err)
                reject(err);
            else {
                resolve(true);
            }
        });
    });
};

exports.getTop3RankedUsers = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT username,score from USER order by SCORE desc limit 3';
        db.all(sql, [], (err, rows) => {
            if (err)
                reject(err);
            else {
                const top3Users = rows.map(row => new User(row.username, row.score, undefined));
                resolve(top3Users);
            }
        });
    });
}
