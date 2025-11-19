'use strict';

const { db } = require('./db')
const { Answer } = require('../objects/Answer');

// get all answers of specific riddle given its ID
exports.getAnswersByRiddleID = (riddleID) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM ANSWER WHERE riddleID=?';
        db.all(sql, [riddleID], (err, rows) => {
            if (err)
                reject(err);
            else {
                const answers = rows.map(row => new Answer(row.riddleID, row.answer, row.author, row.submissionDate));
                resolve(answers);
            }
        });
    });
};

// get all answers of specific user
exports.getAnswersByUsername = (username) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM ANSWER WHERE author=?';
        db.all(sql, [username], (err, rows) => {
            if (err)
                reject(err);
            else {
                const answers = rows.map(row => new Answer(row.riddleID, row.answer, row.author));
                resolve(answers);
            }
        });
    });
};

/**
 * @param {Answer} answer
 */
// create new answer
exports.createNewAnswer = (answer) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO ANSWER(riddleID,answer,author,submissionDate) VALUES(?,?,?,?)';
        db.run(sql, [answer.riddleID, answer.answer, answer.author, answer.submissionDate], function (err) {
            if (err)
                reject(err);
            else {
                resolve(this.lastID);
            }
        });
    });
};