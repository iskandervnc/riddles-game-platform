import '../App.css';
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import { TopBar, TopBarLoggingIn } from "./TopBarComponents";
import { RiddleEntries, ClosedRiddle, OpenRiddle, NewRiddleForm } from "./RiddleComponents";
import { LoginForm } from "./AuthenticationComponents";
import { AnswerForm, EmptyAnswerForm } from './AnswerComponents';
import { ScoreEntries } from './ScoreComponents';
import { RiEmotionSadLine } from 'react-icons/ri';
import { FaAngleDoubleRight, FaAngleDoubleLeft } from 'react-icons/fa';
import { IoCreate } from 'react-icons/io5'
import { useState } from 'react';

function DefaultRoute() {
    return (
        <Container className='App'>
            <h1><b>404</b> Page not found 😔</h1>
            <h2>This is not the route you are looking for!</h2>
        </Container>
    );
}

function HomepageRoute(props) {

    return (
        <>
            <header className="App-header">
                {/* TOP BAR */}
                <TopBar bg='#1363DF' topBarText={props.topBarText} loggedIn={props.loggedIn} top3Users={props.top3Users} />
            </header>
            <hr className="divider"></hr>
            {props.message && <Row>
                <Alert variant={props.message.type} onClose={() => props.setMessage('')} dismissible>{props.message.msg}</Alert>
            </Row>}
            <Container fluid className='mx-auto'>
                <Row>
                    <Col></Col>
                    <Col style={{ marginTop: '20px' }} md={5} align="center"><ScoreEntries users={props.top3Users} /></Col>
                    <Col></Col>
                </Row>
                <hr className='divider'></hr>
                <Row style={{ height: '100vh' }}>
                    <Col className="home-col"></Col>
                    <Col md={7} className="table-col">
                        <Row className='d-flex h2'>
                            <div className="column-title"> Posted Riddles </div>
                        </Row>
                        <br />
                        {props.riddles.length === 0 ?
                            <Row className="mt-4 mb-4"><div style={{ fontSize: '2.5vw' }}><RiEmotionSadLine /></div><div style={{ fontSize: '1.2vw', fontWeight: 'bold', fontVariant: 'small-caps' }}>Nothing to see here </div></Row>
                            :
                            <Row>
                                <RiddleEntries riddles={props.riddles} loggedIn={props.loggedIn} />
                            </Row>
                        }

                    </Col>
                    <Col className="home-col" >
                    </Col>
                </Row>
            </Container>
        </>
    );
}

function LoggedInHomepageRoute(props) {
    const [answering, setAnswering] = useState(false);
    const [viewingClosed, setViewingClosed] = useState(false);
    const [viewingClosedPosted, setViewingClosedPosted] = useState(false);
    const [viewingOpenPosted, setViewingOpenPosted] = useState(false);
    const [selectedRiddle, setSelectedRiddle] = useState();
    const [selectedRiddlePosted, setSelectedRiddlePosted] = useState();
    const [switchPanel, setSwitchPanel] = useState(false);
    const [creatingNewRiddle, setCreatingNewRiddle] = useState(false);
    const [isWinner, setIsWinner] = useState(false);

    const [loadingAnswers, setLoadingAnswers] = useState(true);

    const closedList = props.riddles.filter((r) => r.status === "closed");
    const openList = props.riddles.filter((r) => r.status === "open");

    const switchPanelFunction = (panel) => {
        if (switchPanel === false && panel === "your") {
            setSwitchPanel(true);
        }
        if (switchPanel === true && panel === "browse") {
            setSwitchPanel(false);
        }
    }

    return (
        <>
            <header className="App-header">
                {/* TOP BAR */}
                <TopBar bg='#1363DF' topBarText={props.topBarText} loggedIn={props.loggedIn} logOut={props.logOut} top3Users={props.top3Users} />
            </header>
            {props.message && <Row>
                <Alert variant={props.message.type} onClose={() => props.setMessage('')} dismissible>{props.message.msg}</Alert>
            </Row>}
            <Container fluid className='mx-auto' style={{ height: '100vh', backgroundColor: '#DFF6FF' }}>
                <Row className='d-flex h2' style={{ backgroundColor: 'white', marginTop: '10px' }}>

                    {switchPanel ?
                        <>
                            <Col className="window-text">
                                <div className="h3" style={{ cursor: "pointer" }} onClick={() => { switchPanelFunction("browse"); setLoadingAnswers(true); }}>
                                    <FaAngleDoubleRight className="pulsing-text-arrows" /> Browse Riddles <FaAngleDoubleLeft className="pulsing-text-arrows" />
                                </div>
                            </Col>
                            <Col className=" window-active" ><div className="h3" style={{ cursor: "pointer" }} onClick={() => switchPanelFunction("your")}>
                                Your Riddles Area  </div>
                            </Col>
                        </>
                        :
                        <>
                            <Col className="window-active" >
                                <div className="h3" style={{ cursor: "pointer" }} onClick={() => switchPanelFunction("browse")}>
                                    Browse Riddles
                                </div>
                            </Col>
                            <Col className="window-text">

                                <div className="h3 " style={{ cursor: "pointer" }} onClick={() => { switchPanelFunction("your"); setLoadingAnswers(true); }}>
                                    <FaAngleDoubleRight className="pulsing-text-arrows" /> Your Riddles Area <FaAngleDoubleLeft className="pulsing-text-arrows" />
                                </div>

                            </Col>

                        </>
                    }
                </Row>

                <Row style={{ height: '100vh' }}>
                    {switchPanel ?
                        <>
                            <Col md={7} className="browse-riddles-col" style={{ backgroundColor: '#DFF6FF', border: '1px #d1c9c9 solid' }}>
                                <br />
                                <div className="h3" style={{ fontVariant: 'small-caps' }}> Riddles by {props.user.username} </div>
                                <hr className='divider'></hr>
                                <Row>
                                    {creatingNewRiddle ?
                                        <div className="mt-3" > <Button style={{ fontSize: "20px" }} disabled><IoCreate /> Post new riddle!</Button></div>
                                        :
                                        <>
                                            <Col></Col>
                                            <Col align="center" md={4}>
                                                <div className="mt-3 pulsing-text " > <Button style={{ fontSize: "20px" }} onClick={() => { setCreatingNewRiddle(true); setViewingOpenPosted(false); setViewingClosedPosted(false) }}>
                                                    <IoCreate /> Post new riddle!</Button></div>
                                            </Col>
                                            <Col></Col>
                                        </>
                                    }

                                </Row>
                                <br />
                                {props.postedRiddles.length === 0 ?
                                    <Row className="mt-4 mb-4"><div style={{ fontSize: '2.5vw' }}><RiEmotionSadLine /></div><div style={{ fontSize: '1.2vw', fontWeight: 'bold', fontVariant: 'small-caps' }}>Nothing to see here, post a riddle now!</div></Row>
                                    :
                                    <>
                                        <Row>
                                            <br />
                                            <RiddleEntries riddles={props.postedRiddles} loggedIn={props.loggedIn} userPostedRiddles={true}
                                                setViewingClosed={setViewingClosedPosted} setSelectedRiddle={setSelectedRiddlePosted}
                                                setViewingOpenPosted={setViewingOpenPosted} setCreatingNewRiddle={setCreatingNewRiddle}
                                                setLoadingAnswers={setLoadingAnswers} loadingAnswers={loadingAnswers} />
                                        </Row>
                                    </>
                                }

                            </Col>

                            <Col className="browse-riddles-col" style={{ border: '1px #d1c9c9 solid' }}>
                                {viewingClosedPosted ?
                                    <ClosedRiddle key={selectedRiddlePosted.id} setViewingClosed={setViewingClosedPosted} riddle={selectedRiddlePosted} loadingAnswers={loadingAnswers} setLoadingAnswers={setLoadingAnswers} />
                                    :
                                    <>
                                        {viewingOpenPosted ?
                                            <OpenRiddle key={selectedRiddlePosted.id} setViewingOpenPosted={setViewingOpenPosted} riddle={selectedRiddlePosted} loadingAnswers={loadingAnswers} setLoadingAnswers={setLoadingAnswers} />
                                            :
                                            <>
                                                {creatingNewRiddle ?
                                                    <NewRiddleForm setCreatingNewRiddle={setCreatingNewRiddle} />
                                                    :
                                                    <>
                                                        <Row >
                                                            <Col sm={1}>
                                                                <div style={{ fontSize: '90px', marginTop: '28vh', marginLeft: '1vw' }}>

                                                                </div>
                                                            </Col>
                                                            <Col >
                                                                <EmptyAnswerForm />
                                                            </Col>
                                                        </Row>
                                                    </>
                                                }
                                            </>
                                        }
                                    </>
                                }
                            </Col>
                        </>
                        :
                        <>
                            <Col md={7} className="browse-riddles-col" style={{ border: '1px #d1c9c9 solid' }} >
                                <br />
                                <Row>
                                    <Col></Col>
                                    <Col md={8} align="center"><ScoreEntries users={props.top3Users} /></Col>
                                    <Col></Col>
                                </Row>
                                <hr className='divider'></hr>
                                <br />
                                <Row><div style={{ fontSize: '1.6vw', color: '#47B5FF', fontWeight: 'bold', fontVariant: 'small-caps' }}>Open Riddles</div></Row>
                                {openList.length === 0 ?

                                    <Row className="mt-4 mb-4"><div style={{ fontSize: '2.5vw' }}><RiEmotionSadLine /></div><div style={{ fontSize: '1.2vw', fontWeight: 'bold', fontVariant: 'small-caps' }}>No Open Riddles Available</div></Row>
                                    :
                                    <Row>
                                        <RiddleEntries riddles={openList} loggedIn={props.loggedIn} userPostedRiddles={false}
                                            setAnswering={setAnswering} setSelectedRiddle={setSelectedRiddle} setViewingClosed={setViewingClosed}
                                            IDsOfAnsweredRiddles={props.IDsOfAnsweredRiddles} setIsWinner={setIsWinner} />
                                    </Row>
                                }
                                <hr className='divider'></hr>
                                <Row><div style={{ fontSize: '1.6vw', color: 'red', fontWeight: 'bold', fontVariant: 'small-caps' }}>Closed Riddles</div></Row>
                                {closedList.length === 0 ?
                                    <Row className="mt-4 mb-4"><div style={{ fontSize: '1.6vw' }}><RiEmotionSadLine /></div><div style={{ fontSize: '1.2vw', fontWeight: 'bold', fontVariant: 'small-caps' }}>No Closed Riddles Available</div></Row>
                                    :
                                    <Row>
                                        <RiddleEntries riddles={closedList} loggedIn={props.loggedIn} userPostedRiddles={false}
                                            setViewingClosed={setViewingClosed} setSelectedRiddle={setSelectedRiddle} setAnswering={setAnswering}
                                            IDsOfAnsweredRiddles={undefined} setLoadingAnswers={setLoadingAnswers} loadingAnswers={loadingAnswers}
                                            setIsWinner={setIsWinner} />
                                    </Row>
                                }


                            </Col>

                            <Col className="riddles-action-col" style={{ border: '1px #d1c9c9 solid' }}>
                                {answering ?
                                    <>
                                        < AnswerForm key={selectedRiddle.id} setAnswering={setAnswering} riddle={selectedRiddle} setRiddle={setSelectedRiddle} IDsOfAnsweredRiddles={props.IDsOfAnsweredRiddles}
                                            setIsWinner={setIsWinner} isWinner={isWinner} setIDsOfAnsweredRiddles={props.setIDsOfAnsweredRiddles} />
                                    </>
                                    :
                                    <>
                                        {viewingClosed ?
                                            <ClosedRiddle key={selectedRiddle.id} setViewingClosed={setViewingClosed} riddle={selectedRiddle} loadingAnswers={loadingAnswers} setLoadingAnswers={setLoadingAnswers} />
                                            :
                                            <>
                                                <Row >
                                                    <Col sm={1}>
                                                        <div style={{ fontSize: '90px', marginTop: '46vh', marginLeft: '1vw' }}>

                                                        </div>
                                                    </Col>
                                                    <Col style={{ marginTop: '130px' }}>
                                                        <EmptyAnswerForm />
                                                    </Col>
                                                </Row>
                                            </>
                                        }
                                    </>
                                }
                            </Col>
                        </>
                    }
                </Row>
            </Container>
        </>
    );
}

function LoginRoute(props) {
    return (
        <>
            <header className="App-header">
                {/* TOP BAR */}
                <TopBarLoggingIn bg='#1363DF' />
            </header>
            <hr className="divider"></hr>
            {props.message && <Row>
                <Alert variant={props.message.type} onClose={() => props.setMessage('')} dismissible>{props.message.msg}</Alert> </Row>}
            <LoginForm login={props.login}></LoginForm>
        </>
    )
}

export { DefaultRoute, HomepageRoute, LoggedInHomepageRoute, LoginRoute };