function Riddle(id, question, correctResponse, difficulty, hint1, hint2, duration, status = undefined, author = undefined) {
    this.id = id;
    this.question = question;
    this.correctResponse = correctResponse;
    this.difficulty = difficulty;
    this.hint1 = hint1;
    this.hint2 = hint2;
    this.duration = duration;
    this.status = status;
    this.author = author;
}

exports.Riddle = Riddle;