import { Riddle } from './objects/Riddle';
import { Answer } from './objects/Answer';
import { User } from './objects/User';

const BASE_URL = "http://localhost:3001";

const getAllRiddles = async () => {
    const response = await fetch(`${BASE_URL}/api/riddles`);
    const riddlesJSON = await response.json();
    if (response.ok) {
        return riddlesJSON.map(r => new Riddle(r.id, r.question, r.correctResponse, r.difficulty, r.hint1, r.hint2, r.duration, r.status, r.author));
    } else throw riddlesJSON;
};

const getUserPostedRiddles = async () => {
    const response = await fetch(`${BASE_URL}/api/riddles/user`, { credentials: 'include' });
    const riddlesJSON = await response.json();
    if (response.ok) {
        return riddlesJSON.map(r => new Riddle(r.id, r.question, r.correctResponse, r.difficulty, r.hint1, r.hint2, r.duration, r.status, r.author));
    } else throw riddlesJSON;
}

const getRiddleByID = async (riddleID) => {
    const response = await fetch(`${BASE_URL}/api/riddle/${riddleID}`, { credentials: 'include' });
    const riddleJSON = await response.json();
    if (response.ok) {
        return new Riddle(riddleJSON.id, riddleJSON.question, riddleJSON.correctResponse, riddleJSON.difficulty, riddleJSON.hint1, riddleJSON.hint2, riddleJSON.duration, riddleJSON.status, riddleJSON.author);
    } else throw riddleJSON;
}

const getAnswersOfRiddleById = async (riddleID) => {
    const response = await fetch(`${BASE_URL}/api/answers/riddle${riddleID}`, { credentials: 'include' });
    const answersJSON = await response.json();
    if (response.ok) {
        return answersJSON.map(r => new Answer(r.riddleID, r.answer, r.author, r.submissionDate));
    } else throw answersJSON;
}

const getAnswersOfUser = async () => {
    const response = await fetch(`${BASE_URL}/api/answers/user`, { credentials: 'include' });
    const answersJSON = await response.json();
    if (response.ok) {
        return answersJSON.map(r => new Answer(r.riddleID, r.answer, r.author));
    } else throw answersJSON;
}

const getTop3RankedUsers = async () => {
    const response = await fetch(`${BASE_URL}/api/scores/top`, { credentials: 'include' });
    const answersJSON = await response.json();
    if (response.ok) {
        return answersJSON.map(u => new User(u.username, u.score));
    } else throw answersJSON;
}

const addNewRiddle = async (riddle) => {
    const response = await fetch(`${BASE_URL}/api/riddle`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            question: riddle.question,
            correctResponse: riddle.correctResponse,
            difficulty: riddle.difficulty,
            hint1: riddle.hint1,
            hint2: riddle.hint2,
            duration: riddle.duration,
        })
    });
    if (!response.ok) {
        throw await response.json();
    } else {
        return null;
    }
}

const addNewAnswer = async (answer) => {
    const response = await fetch(`${BASE_URL}/api/answer`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            riddleID: answer.riddleID,
            answer: answer.answer,
        })
    });
    if (!response.ok) {
        throw await response.json();
    } else {
        return null;
    }
}

const updateUserScore = async (gainedPoints) => {
    const response = await fetch(`${BASE_URL}/api/score`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ gainedPoints: gainedPoints }),
    });
    if (response.ok) {
        return null;
    } else {
        throw await response.json();
    }

}
// AUTHENTICATION - APIs
const logIn = async (credentials) => {
    const response = await fetch(BASE_URL + '/api/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        return await response.json();
    }
    else {
        throw await response.text();
    }
};

const getUserInfo = async () => {
    const response = await fetch(BASE_URL + '/api/sessions/current', {
        credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) {
        return user;
    } else {
        throw response.status;
    }
};

const logOut = async () => {
    const response = await fetch(BASE_URL + '/api/sessions/current', {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok)
        return null;
}

const API = {
    getAllRiddles,
    getRiddleByID,
    getUserPostedRiddles,
    getAnswersOfRiddleById,
    getAnswersOfUser,
    addNewRiddle,
    addNewAnswer,
    updateUserScore,
    getTop3RankedUsers,
    logIn,
    logOut,
    getUserInfo,
};

export default API;