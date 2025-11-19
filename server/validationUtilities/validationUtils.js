const { Riddle } = require('../objects/Riddle');
const { Answer } = require('../objects/Answer');

/**
 * @param {Riddle} riddle
 */
exports.validateRiddle = async (riddle) => {
    if ((riddle.difficulty !== "easy" && riddle.difficulty !== "average" && riddle.difficulty !== "difficult") || (riddle.duration < 30 && riddle.duration > 600) ||
        riddle.author === undefined || riddle.correctResponse === undefined || riddle.difficulty === undefined || riddle.duration === undefined
        || riddle.hint1 === undefined || riddle.hint2 === undefined) {
        return false;
    } else return true;
}

exports.validatePoints = async (points) => {
    if ((points !== 1 && points !== 2 && points !== 3) || points === undefined) {
        return false;
    } else return true;
}

/**
 * @param {Answer} answer
 * @param {Riddle} riddle
 */
exports.validateAnswer = async (answer, riddle) => {
    if (answer.answer === undefined || answer.author === undefined || answer.riddleID === undefined || answer.submissionDate === undefined || riddle.status === "closed") {
        return false;
    } else return true;
}