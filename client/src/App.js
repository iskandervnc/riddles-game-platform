import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from "react-bootstrap";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import API from "./API"
import { DefaultRoute, HomepageRoute, LoggedInHomepageRoute, LoginRoute } from "./components/Views";

function App() {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [topBarText, setTopBarText] = useState('Login to play or post your own riddles!');
  const [riddles, setRiddles] = useState([]);
  const [postedRiddles, setPostedRiddles] = useState([]);
  const [externalRiddles, setExternalRiddles] = useState([]);
  const [refreshList, setRList] = useState(0);
  const [IDsOfAnsweredRiddles, setIDsOfAnsweredRiddles] = useState([]);
  const [top3Users, setTop3Users] = useState([]);

  // SET DATA AT FIRST RENDER AND EACH TIME USER LOGIN/LOGOUT
  useEffect(() => {
    getAllRiddles()
      .catch((e) => console.log(e));
    getPostedRiddles()
      .catch((e) => console.log(e));
    getUserAnswers()
      .catch((e) => console.log(e));
    getTop3RankedUsers()
      .catch((e) => console.log(e));
  }, [loggedIn]);

  useEffect(() => {
    const refreshData = () => {
      if (!loggedIn) {
        getAllRiddles();
        getTop3RankedUsers();
      } else {
        getAllRiddles();
        getPostedRiddles();
        getTop3RankedUsers();
      }
      if (refreshList === 0) {
        setRList(1);
      } else setRList(0);
    }
    const interval = setInterval(() => {
      refreshData();
    }, 3000);
    return () => clearInterval(interval);
  }, [refreshList]);

  const getAllRiddles = async () => {
    try {
      const list = await API.getAllRiddles();
      setRiddles(list);
    } catch (error) {
      console.log(error);
    }
  }

  const getPostedRiddles = async () => {
    try {
      if (loggedIn === true) {
        const list = await API.getUserPostedRiddles();
        setPostedRiddles(list);
        let extRiddles = riddles.filter((r) => r.author !== user.username);
        setExternalRiddles(extRiddles);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getUserAnswers = async () => {
    try {
      if (loggedIn === true) {
        const userAnswers = await API.getAnswersOfUser();
        setIDsOfAnsweredRiddles(userAnswers.map((a) => a.riddleID));
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getTop3RankedUsers = async () => {
    try {
      const top3 = await API.getTop3RankedUsers();
      let position = 1;
      for (let t of top3) {
        t.rank = position;
        position += 1;
      }
      setTop3Users(top3);
    } catch (error) {
      console.log(error);
    }
  }

  //  LOGIN/LOGOUT FUNCTION 
  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
      setTopBarText(user.username);
      setMessage({ msg: `Successfully logged in - Welcome, ${user.username}!`, type: 'info' });
    } catch (err) {
      console.log(err);
      setMessage({ msg: "Wrong username or password", type: 'danger' });
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    // Reset and update again data
    setUser(null);
    setTopBarText('Login to play or post your own riddles!');
    setMessage('');
  };

  // RETRIEVE DATA FROM SESSION TO KEEP LOGIN
  useEffect(() => {
    const checkAuth = async () => {
      const user = await API.getUserInfo(); //  user info 
      setLoggedIn(true);
      setUser(user);
      setTopBarText(user.username);
    };
    checkAuth()
      .catch((e) => {
        if (e === 401 || e === 403) {
          setLoggedIn(false);
        }
      });
  }, []);

  return (
    <Container fluid style={{ marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 }} className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<DefaultRoute />} />
          <Route path='/' element={loggedIn ? <Navigate replace to={`/solveMyRiddle/loggedIn/${user.username}`} /> : <Navigate replace to='/solveMyRiddle' />} />

          <Route path='/solveMyRiddle' element={loggedIn ? <Navigate replace to={`/solveMyRiddle/loggedIn/${user.username}`} />
            : <HomepageRoute topBarText={topBarText} message={message} setMessage={setMessage} riddles={riddles} loggedIn={loggedIn} setLoggedIn={setLoggedIn} top3Users={top3Users} />} />

          <Route path='/solveMyRiddle/login' element={loggedIn ? <Navigate replace to={`/solveMyRiddle/loggedIn/${user.username}`} /> :
            <LoginRoute login={handleLogin} loggedIn={loggedIn} message={message} setMessage={setMessage} />} />

          <Route path='/solveMyRiddle/loggedIn/:username' element={loggedIn ? <LoggedInHomepageRoute topBarText={topBarText} message={message} setMessage={setMessage} user={user}
            riddles={externalRiddles} postedRiddles={postedRiddles} logOut={handleLogout} loggedIn={loggedIn}
            IDsOfAnsweredRiddles={IDsOfAnsweredRiddles} setIDsOfAnsweredRiddles={setIDsOfAnsweredRiddles} top3Users={top3Users} />
            : <Navigate replace to='/solveMyRiddle' />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
