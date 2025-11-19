import { Col, Table, Button, Row, Container, Form } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { AnswerEntries } from './AnswerComponents';
import { IoThumbsUpSharp, IoChevronForward, IoShareOutline } from 'react-icons/io5'
import { BiShow, BiHide, BiChevronsRight, BiCommentError } from 'react-icons/bi'
import { VscCloseAll } from 'react-icons/vsc'
import { RiTimerFill } from 'react-icons/ri'
import API from "../API"
import { Riddle } from '../objects/Riddle';
import Spinner from 'react-bootstrap/Spinner';


function ClosedRiddle(props) {
    const [answers, setAnswers] = useState([]);
    const [winner, setWinner] = useState(false);
    const [showCorrect, setShowCorrect] = useState(false);

    useEffect(() => {
        const getAnswers = async (callback) => {
            const list = await API.getAnswersOfRiddleById(props.riddle.id);
            list.forEach((a) => {
                let splittedAnswer = a.answer.split(" ");
                for (let sa of splittedAnswer) {
                    if (sa.toLowerCase() === props.riddle.correctResponse.toLowerCase()) {
                        setWinner(a.author);
                    }
                }
            })
            setAnswers(list);
            callback();
        };
        const stopLoading = () => {
            props.setLoadingAnswers(false);
        }
        getAnswers(stopLoading);
    }, [props.loadingAnswers])


    return (
        <Container fluid>
            <Row className="justify-content-center fill">
                <Col sm={8} align="left" className="closed-riddle-panel" style={{ marginTop: '9vw' }}>
                    <Row className='mb-2'>
                        <div className='h4 question-closed-text' style={{ color: 'black', backgroundColor: 'white', border: '1px solid black', padding: '5px' }}>{props.riddle.question}</div>
                    </Row>

                    <Row>
                        <div className='divider mb-3' style={{ border: '1px solid black' }}></div>
                        {winner ?
                            <>
                                <Row>
                                    <Col align="center" sm={4}>
                                        <div className="h4 ">
                                            <span className="h4" style={{ textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black', color: '#00ff00' }}> <IoThumbsUpSharp /> WINNER </span>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div align="left" className="h4 waviy">
                                            <span className="h4 waviy" style={{ textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black', }}>{winner}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <hr className='divider mb-2'></hr>
                                <Row>
                                    <div className="h4 ">
                                        <span className="h5" style={{ color: 'white' }}> <IoChevronForward /> Correct answer : {showCorrect ?
                                            <><Button variant="dark" onClick={() => setShowCorrect(false)}> Hide&nbsp;<BiHide ></BiHide></Button>
                                                <Row> <Col style={{ color: 'black' }}> &nbsp;&nbsp;&nbsp;<BiChevronsRight />{props.riddle.correctResponse}</Col> </Row> </>
                                            :
                                            <Button variant="success" onClick={() => setShowCorrect(true)}>Show&nbsp;<BiShow ></BiShow></Button>}
                                        </span>
                                    </div>
                                </Row>
                            </>
                            :
                            <>
                                <Row><Col align="center"><div style={{ fontSize: '50px' }}><BiCommentError style={{ color: 'white' }} /></div> </Col></Row>
                                <Col >
                                    <div className="h4 mb-5">
                                        <span className="h5 " style={{ textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black', color: 'white' }}> Nobody could answer correctly to this riddle</span>
                                    </div>
                                </Col>

                                <hr className='divider mb-2'></hr>
                                <Row>
                                    <div className="h4 ">
                                        <span className="h5" style={{ color: 'white' }}> <IoChevronForward /> Correct answer : {showCorrect ?
                                            <><Button variant="dark" onClick={() => setShowCorrect(false)}> Hide&nbsp;<BiHide ></BiHide></Button>
                                                <Row> <Col style={{ color: 'black' }}> &nbsp;&nbsp;&nbsp;<BiChevronsRight />{props.riddle.correctResponse}</Col> </Row></>
                                            :
                                            <Button variant="success" onClick={() => setShowCorrect(true)}>Show&nbsp;<BiShow ></BiShow></Button>}
                                        </span>
                                    </div>
                                </Row>
                            </>
                        }
                        <div className='divider'></div>
                        <Row>
                            <Col align='center'>
                                <div style={{ padding: '3px' }}></div>
                                <Button onClick={() => props.setViewingClosed(false)} variant="warning" style={{ marginBottom: '15px', fontSize: '19px', marginLeft: "25px" }}>
                                    <VscCloseAll /> Close panel</Button>
                            </Col>
                        </Row>
                    </Row>
                    <Row className="mt-2">
                        {props.loadingAnswers ?
                            <>
                                <Col align="center">
                                    <Spinner variant="warning" animation="border" role="status" ><span className="visually-hidden">Loading...</span></Spinner>
                                </Col>
                            </>
                            :
                            <AnswerEntries answers={answers} />
                        }
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

function OpenRiddle(props) {
    const [answers, setAnswers] = useState([]);
    const [showCorrect, setShowCorrect] = useState(false);
    const [refreshAnswers, setRAnswers] = useState(0);
    const [showHint1, setShowHint1] = useState(false);
    const [showHint2, setShowHint2] = useState(false);
    const [isOpenPostedRiddle, setIsOpenPostedRiddle] = useState(true);
    const [isClosed, setIsClosed] = useState(false);
    const [time, setTime] = useState(props.riddle.duration);

    useEffect(() => {
        const refreshData = (callback) => {
            getAnswers();
            if (refreshAnswers === 0) {
                setRAnswers(1);
            } else setRAnswers(0);
            callback();
        }
        const stopLoading = () => {
            props.setLoadingAnswers(false);
        }

        const interval = setInterval(() => {
            refreshData(stopLoading);
        }, 1000);
        return () => clearInterval(interval);
    }, [refreshAnswers]);

    const getAnswers = async () => {
        const list = await API.getAnswersOfRiddleById(props.riddle.id);
        const riddle = await API.getRiddleByID(props.riddle.id);
        if (riddle.status === "closed") {
            setIsClosed(true);
        }
        setAnswers(list);
    };

    return (
        <Container fluid>
            <Row className="justify-content-center fill">
                <Col sm={8} align="left" className="answer-form" style={{ marginTop: '9vw' }}>
                    <Row className='mb-2'>
                        <div className='h5 question-open-text' style={{ color: 'black', backgroundColor: 'white', border: '1px solid black', padding: '5px' }}>{props.riddle.question}</div>
                    </Row>

                    <Row>
                        <div className='divider mb-3' style={{ border: '1px solid black' }}></div>
                        <Row>
                            <div className="h4 ">
                                <span className="h5" style={{ color: 'white' }}> <IoChevronForward /> Correct answer : {showCorrect ?
                                    <><Button variant="dark" onClick={() => setShowCorrect(false)}> Hide&nbsp;<BiHide ></BiHide></Button>
                                        <Row> <Col style={{ color: 'black' }}> &nbsp;&nbsp;&nbsp;<BiChevronsRight />{props.riddle.correctResponse}</Col> </Row></>
                                    :
                                    <Button variant="success" onClick={() => setShowCorrect(true)}>Show&nbsp;<BiShow ></BiShow></Button>}
                                </span>
                            </div>
                        </Row>
                        <div className='divider mb-2'></div>
                        <RiddleTimer key={props.riddle.id} isClosed={isClosed} riddleID={props.riddle.id} duration={props.riddle.duration} time={time} setTime={setTime} showHint1={showHint1} showHint2={showHint2} isOpenPostedRiddle={isOpenPostedRiddle} />
                        <Row>
                            <Col align='center'>
                                <div style={{ padding: '3px' }}></div>
                                <Button onClick={() => props.setViewingOpenPosted(false)} variant="warning" style={{ marginBottom: '15px', fontSize: '19px', marginLeft: "25px" }}>
                                    <VscCloseAll /> Close panel </Button>
                            </Col>
                        </Row>
                    </Row>
                    <Row className="mt-2">
                        {props.loadingAnswers ?
                            <>
                                <Col align="center">
                                    <Spinner variant="warning" animation="border" role="status" ><span className="visually-hidden">Loading...</span></Spinner>
                                </Col>
                            </>
                            :
                            <AnswerEntries answers={answers} />
                        }
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

function NewRiddleForm(props) {
    const [riddleQuestion, setRiddleQuestion] = useState("");
    const [riddleAnswer, setRiddleAnswer] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
    const [hint1, setHint1] = useState('');
    const [hint2, setHint2] = useState('');
    const [duration, setDuration] = useState(30);

    const handleSubmit = (event) => {
        event.preventDefault();
        submitNewRiddle(new Riddle(undefined, riddleQuestion, riddleAnswer, selectedDifficulty, hint1, hint2, duration));
        props.setCreatingNewRiddle(false)
    };
    const submitNewRiddle = async (riddle) => {
        await API.addNewRiddle(riddle)
    };

    return (
        <Row className="justify-content-center fill ">
            <Col sm={6} align="left" className="login-form" style={{ marginTop: '1vh' }}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId='question' style={{ width: '100%' }}>
                        <Form.Label style={{ fontSize: 18, color: 'white' }}>Riddle</Form.Label>
                        <Form.Control as="textarea" rows="3" type='text' style={{ border: '1px black solid' }} value={riddleQuestion} onChange={ev => setRiddleQuestion(ev.target.value)}
                            required={true} />
                    </Form.Group>
                    <br />
                    <Form.Group controlId='answer'>
                        <Form.Label style={{ fontSize: 18, color: 'white' }}>Answer</Form.Label>
                        <Form.Control placeholder="Only one word ( if the answer is a sentence try to enter only one key word; Example... Answer : He's bald => bald)" as="textarea" rows="3" type='text' style={{ border: '1px black solid' }} value={riddleAnswer} onChange={ev => setRiddleAnswer(ev.target.value)}
                            required={true}
                            minLength={1} />
                    </Form.Group>
                    <br />
                    <Form.Group controlId='hint1'>
                        <Form.Label style={{ fontSize: 18, color: 'white' }}>Hint#1</Form.Label>
                        <Form.Control as="textarea" rows="2" type='text' style={{ border: '1px black solid' }} value={hint1} onChange={ev => setHint1(ev.target.value)}
                            required={true}
                            minLength={1} />
                    </Form.Group>
                    <br />
                    <Form.Group controlId='hinte2'>
                        <Form.Label style={{ fontSize: 18, color: 'white' }}>Hint#2</Form.Label>
                        <Form.Control as="textarea" rows="2" type='text' style={{ border: '1px black solid' }} value={hint2} onChange={ev => setHint2(ev.target.value)}
                            required={true}
                            minLength={1} />
                    </Form.Group>
                    <br />
                    <Form.Group className="mb-3">
                        <Form.Label style={{ fontSize: 18, color: 'white' }}> Select difficulty : </Form.Label>
                        <Form.Select className="mt-3" size="md" style={{ border: '1px black solid' }} value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
                            <option value="easy" > Easy </option>
                            <option value="average" > Average </option>
                            <option value="difficult" > Difficult </option>
                        </Form.Select>
                    </Form.Group>
                    <br />
                    <Form.Group controlId='duration'>
                        <Form.Label style={{ fontSize: 18, color: 'white' }}>Duration ( min : 30 - max : 600 )</Form.Label>
                        <Form.Control type='number' style={{ border: '1px black solid' }} value={duration} min={30} max={600} required={true} onChange={(e) => setDuration(e.target.value)} />
                    </Form.Group>
                    <br />
                    <Row>
                        <Col align="left">
                            <Button onClick={() => props.setCreatingNewRiddle(false)} variant="dark" style={{ margin: '2px', fontSize: '20px' }}><VscCloseAll /> Close </Button>
                        </Col>
                        <Col align="right">
                            <Button type="submit" variant="success" style={{ fontSize: '20px', marginTop: '2px' }}> Submit  <IoShareOutline /></Button>
                        </Col>
                    </Row>
                </Form>
            </Col>
        </Row>
    );
}

function RiddleTimer(props) {

    const dayjs = require('dayjs');
    var minMax = require('dayjs/plugin/minMax')
    var customParseFormat = require('dayjs/plugin/customParseFormat')
    dayjs.extend(customParseFormat)
    dayjs.extend(minMax)

    const getElapsedTimeFromFirstAnswer = async () => {
        const answers = await API.getAnswersOfRiddleById(props.riddleID);
        const dates = answers.map((a) => dayjs(a.submissionDate, 'YYYY-MM-DDTHH:mm:ssZ[Z]'));
        const firstDate = dayjs.min(dates);
        const now = dayjs();
        const difference = now.diff(firstDate, "second");
        const startingTime = props.duration - difference;
        if (startingTime > 0) {
            props.setTime(startingTime);
        } else {
            props.setTime(0);
        }

    }

    getElapsedTimeFromFirstAnswer();

    return (
        <>
            {props.isOpenPostedRiddle ?
                <>
                    {props.isClosed ?
                        <Row></Row>
                        :
                        <>
                            {props.time !== 0 ?
                                <>
                                    <Row>
                                        <Col></Col>
                                        <Col sm={5} align="center" style={{ backgroundColor: '#47B5FF' }}>
                                            <div style={{ fontSize: '35px', color: 'black', textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black' }}> <RiTimerFill style={{ fontSize: '50px', marginBottom: '10px', color: 'black' }} /> {props.time} </div>
                                        </Col>
                                        <Col></Col>
                                    </Row>
                                </>
                                :
                                <Row></Row>
                            }
                        </>
                    }
                </>

                :
                <>
                    {props.showHint1 ?
                        <>
                            {props.showHint2 ?
                                <Row >
                                    <Col></Col>
                                    <Col sm={5} align="center" style={{ backgroundColor: '#47B5FF' }}>
                                        <div className="pulsing-text-strong" style={{ fontSize: '35px', color: 'red', textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black' }}> <RiTimerFill style={{ fontSize: '50px', marginBottom: '10px', color: 'red' }} /> {props.time} </div>
                                    </Col>
                                    <Col></Col>
                                </Row>
                                :
                                <Row >
                                    <Col></Col>
                                    <Col sm={5} align="center" style={{ backgroundColor: '#47B5FF' }}>
                                        <div className="pulsing-text-light" style={{ fontSize: '35px', color: 'yellow', textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black' }}> <RiTimerFill style={{ fontSize: '50px', marginBottom: '10px', color: 'yellow' }} /> {props.time} </div>
                                    </Col>
                                    <Col></Col>
                                </Row>
                            }
                        </>
                        :
                        <>
                            <Row >
                                <Col></Col>
                                <Col sm={5} align="center" style={{ backgroundColor: '#47B5FF' }}>
                                    <div style={{ fontSize: '35px' }}><RiTimerFill style={{ fontSize: '50px', marginBottom: '10px' }} /> {props.time} </div>
                                </Col>
                                <Col></Col>
                            </Row>
                        </>
                    }
                </>
            }
        </>
    );
}

function RiddleEntries(props) {
    return (
        <Col>
            <RiddlesTable riddles={props.riddles} loggedIn={props.loggedIn}
                userPostedRiddles={props.userPostedRiddles} setAnswering={props.setAnswering}
                setViewingClosed={props.setViewingClosed} setSelectedRiddle={props.setSelectedRiddle}
                setViewingOpenPosted={props.setViewingOpenPosted} setCreatingNewRiddle={props.setCreatingNewRiddle}
                IDsOfAnsweredRiddles={props.IDsOfAnsweredRiddles} setLoadingAnswers={props.setLoadingAnswers} loadingAnswers={props.loadingAnswers}
                setIsWinner={props.setIsWinner}
            />
        </Col>
    );
}

function RiddlesTable(props) {

    const list = props.riddles;

    return (
        <div className="align">
            <Table striped bordered hover size="lg" responsive="sm" variant="" style={{ borderCollapse: 'collapse', borderBottom: '1px solid #808080' }}>
                <thead className='h5'>
                    <tr style={{ border: '1px black solid' }}>
                        {props.loggedIn ?
                            <>
                                {props.userPostedRiddles ?
                                    <>
                                        <th className='table-column-title'>Riddle</th>
                                        <th className='table-column-title'>Difficulty</th>
                                        <th className='table-column-title'>Status</th>
                                        <th className='table-column-title'></th>
                                    </>
                                    :
                                    <>
                                        <th className='table-column-title'>Riddle</th>
                                        <th className='table-column-title'>Difficulty</th>
                                        <th className='table-column-title'></th>
                                    </>
                                }
                            </>
                            :
                            <>
                                <th className='table-column-title'>Riddle</th>
                                <th className='table-column-title'>Difficulty</th>
                                <th className='table-column-title'>Status</th>
                            </>

                        }
                    </tr>
                </thead>
                <tbody style={{ backgroundColor: "#e6fae9" }}>
                    {list.map((r) => <RiddleRow riddle={r} key={r.id} userPostedRiddles={props.userPostedRiddles}
                        loggedIn={props.loggedIn} setAnswering={props.setAnswering}
                        setViewingClosed={props.setViewingClosed} setSelectedRiddle={props.setSelectedRiddle}
                        setViewingOpenPosted={props.setViewingOpenPosted} setCreatingNewRiddle={props.setCreatingNewRiddle}
                        IDsOfAnsweredRiddles={props.IDsOfAnsweredRiddles} setLoadingAnswers={props.setLoadingAnswers} loadingAnswers={props.loadingAnswers}
                        setIsWinner={props.setIsWinner} />)}
                </tbody>
            </Table>
        </div>
    );
}
function RiddleRow(props) {

    return (
        <>
            <tr className='align-middle' style={{ backgroundColor: '#47B5FF' }}><RiddleData riddle={props.riddle} userPostedRiddles={props.userPostedRiddles}
                loggedIn={props.loggedIn} setAnswering={props.setAnswering} setViewingClosed={props.setViewingClosed}
                setSelectedRiddle={props.setSelectedRiddle} setViewingOpenPosted={props.setViewingOpenPosted} setCreatingNewRiddle={props.setCreatingNewRiddle}
                IDsOfAnsweredRiddles={props.IDsOfAnsweredRiddles} setLoadingAnswers={props.setLoadingAnswers} loadingAnswers={props.loadingAnswers}
                setIsWinner={props.setIsWinner} /></tr>
        </>
    );
}

function RiddleData(props) {

    const isRiddleOpen = () => {
        if (props.riddle.status === "closed") {
            return false;
        }
        else return true;
    }

    const checkIfIdIsInside = (id) => {
        if (props.IDsOfAnsweredRiddles !== undefined) {
            for (let i of props.IDsOfAnsweredRiddles) {
                if (id === i) {
                    return (true);
                }
            }
            return false;
        }
    }

    const isRiddleAnswered = () => {
        if (checkIfIdIsInside(props.riddle.id)) {
            return (true);
        } else return false;
    }

    return (
        <>
            {props.loggedIn ?
                <>
                    {props.userPostedRiddles ?
                        <>
                            <td className="table-content" style={{ fontSize: '14px' }}>{props.riddle.question}</td>
                            <td className="table-content" style={{ fontVariant: 'small-caps', fontSize: '24px', textShadow: '0 0 1px #fff, 0 0 1px #fff, 0 0 2px #fff, 0 0 3px #fff, 0 0 4px #fff, 0 0 5px #fff, 0 0 6px #fff' }}>{props.riddle.difficulty}</td>
                            <td className="table-content bordered-text" style={isRiddleOpen() ? { color: '#00ff00', fontWeight: 'bold', fontSize: '18px' } : { color: 'red', fontWeight: 'bold' }} >{props.riddle.status.toUpperCase()}</td>
                            <td className="table-content" > <Button variant="warning" onClick={() => {
                                if (isRiddleOpen()) { props.setLoadingAnswers(true); props.setViewingClosed(false); props.setViewingOpenPosted(true); props.setSelectedRiddle(props.riddle); props.setCreatingNewRiddle(false) }
                                else { props.setLoadingAnswers(true); props.setViewingOpenPosted(false); props.setViewingClosed(true); props.setSelectedRiddle(props.riddle); props.setCreatingNewRiddle(false) }
                            }}>Details</Button></td>
                        </>
                        :
                        <>
                            <td className="table-content" >{props.riddle.question}</td>
                            <td className="table-content" style={{ fontVariant: 'small-caps', fontSize: '24px', textShadow: '0 0 1px #fff, 0 0 1px #fff, 0 0 2px #fff, 0 0 3px #fff, 0 0 4px #fff, 0 0 5px #fff, 0 0 6px #fff' }}>{props.riddle.difficulty}</td>
                            <td className="table-content" style={isRiddleOpen() ?
                                { width: "115px" } : { width: "138px" }}>

                                {isRiddleOpen() ?
                                    <>
                                        {isRiddleAnswered() ?
                                            <Button variant="secondary" style={{ color: "#ffff0", fontWeight: "bold", fontSize: "13px" }}> ANSWERED </Button>
                                            :
                                            <Button variant="dark" style={{ color: "#ffff0", fontWeight: "bold" }} onClick={() => {
                                                props.setAnswering(true); props.setSelectedRiddle(props.riddle); props.setViewingClosed(false);
                                                props.setIsWinner(false);
                                            }}>
                                                <div className="animated-answer-text">
                                                    <span style={{ span: '--i:1', fontSize: "15px", color: 'white' }}>A</span>
                                                    <span style={{ span: '--i:2', fontSize: "15px", color: 'white' }}>N</span>
                                                    <span style={{ span: '--i:3', fontSize: "15px", color: 'white' }}>S</span>
                                                    <span style={{ span: '--i:4', fontSize: "15px", color: 'white' }}>W</span>
                                                    <span style={{ span: '--i:5', fontSize: "15px", color: 'white' }}>E</span>
                                                    <span style={{ span: '--i:6', fontSize: "15px", color: 'white' }}>R</span>
                                                    <span style={{ span: '--i:7', fontSize: "15px", color: 'white' }}>!</span>
                                                </div></Button>
                                        }
                                    </>
                                    :
                                    <>
                                        <Button variant="warning" onClick={() => {
                                            props.setLoadingAnswers(true); props.setAnswering(false);
                                            props.setViewingClosed(true); props.setSelectedRiddle(props.riddle); props.setIsWinner(false)
                                        }}>View details</Button>

                                    </>
                                } </td>
                        </>
                    }
                </>
                :
                <>
                    <td className="table-content" >{props.riddle.question}</td>
                    <td className="table-content" style={{ fontVariant: 'small-caps', fontSize: '24px', textShadow: '0 0 1px #fff, 0 0 1px #fff, 0 0 2px #fff, 0 0 3px #fff, 0 0 4px #fff, 0 0 5px #fff, 0 0 6px #fff' }}>{props.riddle.difficulty}</td>
                    <td className="table-content bordered-text" style={isRiddleOpen() ? { color: '#00ff00', fontWeight: 'bold', fontSize: '18px' } : { color: 'red', fontWeight: 'bold', fontSize: '18px' }} >{props.riddle.status.toUpperCase()}</td>
                </>
            }
        </>
    );
}



export { RiddleEntries, ClosedRiddle, OpenRiddle, NewRiddleForm, RiddleTimer }