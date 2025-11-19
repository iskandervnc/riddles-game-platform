'use strict';

const { db } = require('./db')
const { Riddle } = require('../objects/Riddle');

// get all riddles in the database
exports.listAllRiddles = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM RIDDLE';
        db.all(sql, [], (err, rows) => {
            if (err)
                reject(err);
            else {
                const riddles = rows.map(row => new Riddle(row.id, row.question, row.correctResponse, row.difficulty, row.hint1, row.hint2, row.duration, row.status, row.author));
                resolve(riddles);
            }
        });
    });
};

// get all riddles in the database of specific user
exports.getRiddlesByUsername = (username) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM RIDDLE WHERE author=?';
        db.all(sql, [username], (err, rows) => {
            if (err)
                reject(err);
            else {
                const riddles = rows.map(row => new Riddle(row.id, row.question, row.correctResponse, row.difficulty, row.hint1, row.hint2, row.duration, row.status, row.author));
                resolve(riddles);
            }
        });
    });
};

// get correctResponse (entire riddle) of riddle by id
exports.getRiddleByID = (riddleID) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM RIDDLE WHERE id=?';
        db.get(sql, [riddleID], (err, row) => {
            if (err)
                reject(err);
            else {
                const riddle = new Riddle(row.id, row.question, row.correctResponse, row.difficulty, row.hint1, row.hint2, row.duration, row.status, row.author);
                resolve(riddle);
            }
        });
    });
};

/**
 * @param {Riddle} riddle
 */
// create new riddle
exports.createNewRiddle = (riddle) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO RIDDLE(question,correctResponse,difficulty,hint1,hint2,duration,status,author) VALUES(?,?,?,?,?,?,?,?)';
        db.run(sql, [riddle.question, riddle.correctResponse, riddle.difficulty, riddle.hint1, riddle.hint2, riddle.duration, riddle.status, riddle.author], function (err) {
            if (err)
                reject(err);
            else {
                resolve(this.lastID);
            }
        });
    });
};

// update status of riddle
exports.updateStatus = (riddleID) => {
    const closedStatus = "closed";
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE RIDDLE SET status = ? WHERE id = ?';
        db.run(sql, [closedStatus, riddleID], function (err) {
            if (err)
                reject(err);
            else {
                resolve(true);
            }
        });
    });
};