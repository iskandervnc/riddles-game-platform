function User(username, score, rank = undefined) {
    this.username = username;
    this.score = score;
    this.rank = rank;
}

exports.User = User;