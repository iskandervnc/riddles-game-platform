import { useEffect, useState } from 'react';
import { Form, Button, Row, Col, Container, Table } from 'react-bootstrap';
import { IoAlertCircleSharp } from 'react-icons/io5'
import { MdOutlineQuestionAnswer } from 'react-icons/md'
import { VscCloseAll } from 'react-icons/vsc'
import { AiFillFileUnknown } from 'react-icons/ai'
import { RiddleTimer } from './RiddleComponents'
import { HiLightBulb } from 'react-icons/hi'
import { TbArrowForward } from 'react-icons/tb'
import API from "../API"
import { Answer } from '../objects/Answer'


function AnswerForm(props) {
    const [answer, setAnswer] = useState('');
    const [isAnswerWrong, setIsAnswerWrong] = useState(false);
    const [refreshStatus, setRefreshStatus] = useState(0);
    const [neverAnswered, setNeverAnswered] = useState(true);
    const [riddleIsClosed, setRiddleIsClosed] = useState(false);
    const [showHint1, setShowHint1] = useState(false);
    const [showHint2, setShowHint2] = useState(false);
    const [isOpenPostedRiddle, setIsOpenPostedRiddle] = useState(false);
    const [time, setTime] = useState(props.riddle.duration);
    let oldTime = undefined;

    const handleSubmit = (event) => {
        event.preventDefault();
        submitNewAnswer(new Answer(props.riddle.id, answer, undefined, undefined), updateListOfAnsweredIDsAndUserScore);
    };

    useEffect(() => {
        const refreshData = () => {
            if (props.riddle.status !== "closed") {
                getUpdatedRiddle();
                if (refreshStatus === 0) {
                    setRefreshStatus(1);
                } else setRefreshStatus(0);
            }
        }

        const getUpdatedRiddle = async () => {
            try {
                let updatedRiddle = await API.getRiddleByID(props.riddle.id);
                if (neverAnswered) {
                    let answers = await API.getAnswersOfRiddleById(props.riddle.id);
                    if (answers.length > 0) {
                        setNeverAnswered(false);
                    }
                }
                props.setRiddle(updatedRiddle);
            } catch (err) {
                console.log(err);
            }
        }

        const interval = setInterval(() => {
            refreshData();

            if (props.riddle.status === "closed") {
                setRiddleIsClosed(true);
            }
            if (time > 0) {
                if (oldTime !== undefined || oldTime > time) {
                    oldTime = time;
                    setTime(time - 1);
                }
            } else {
                setRiddleIsClosed(true);
                clearInterval(interval);
            }
            isTimeLeftLessThan(50, time);
            isTimeLeftLessThan(25, time);
        }, 1000);
        return () => clearInterval(interval);
    }, [refreshStatus]);

    const isTimeLeftLessThan = (percentage, time) => {
        const threshold = Math.round((percentage / 100) * props.riddle.duration);
        if (percentage === 50 && !showHint1) {
            if (time <= threshold + 1) {
                setShowHint1(true);
            } return;
        }
        if (percentage === 25 && !showHint2) {
            if (time <= threshold + 1) {
                setShowHint2(true);
            } return;
        }
    }

    const submitNewAnswer = async (answer, callback) => {
        let correctlyAnswered = false;
        await API.addNewAnswer(answer);
        let splittedAnswer = answer.answer.split(" ");
        for (let sa of splittedAnswer) {
            if (sa.toLowerCase() === props.riddle.correctResponse.toLowerCase()) {
                correctlyAnswered = true;
            }
        }
        callback(answer.riddleID, correctlyAnswered);
    }

    const updateListOfAnsweredIDsAndUserScore = (riddleID, correctlyAnswered) => {
        let tmpArray = [...props.IDsOfAnsweredRiddles, riddleID];
        props.setIDsOfAnsweredRiddles(tmpArray);
        if (correctlyAnswered) {
            props.setIsWinner(true);
            if (props.riddle.difficulty === "easy") { API.updateUserScore(1); }
            else if (props.riddle.difficulty === "average") { API.updateUserScore(2); }
            else if (props.riddle.difficulty === "difficult") { API.updateUserScore(3); }
        } else {
            setIsAnswerWrong(true);
        }
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


    return (
        <Container fluid>

            <Row className="justify-content-center fill" style={{ marginTop: "15vw" }}>

                <Col sm={8} align="left" className="answer-form">

                    <Row >
                        <div className='h5 question-open-text' style={{ color: 'black', backgroundColor: 'white', border: '1px solid black', padding: '5px' }}>{props.riddle.question}</div>
                    </Row>
                    <Row className='mb-2'>
                        {checkIfIdIsInside(props.riddle.id) ?
                            ""
                            :
                            <>
                                {showHint1 ?
                                    <>
                                        <div className='h6 bordered-text' style={{ backgroundColor: '#1363DF', border: '1px solid black', color: 'white' }}> <HiLightBulb style={{ fontSize: '30px', marginBottom: '5px', color: 'yellow' }} /> HINT#1 : </div>
                                        <div className='h6'  ><TbArrowForward style={{ fontSize: '30px' }} /> {props.riddle.hint1}</div>
                                        <hr className='divider'></hr>
                                        <>
                                            {showHint2 ?
                                                <>
                                                    <div className='h6 bordered-text' style={{ backgroundColor: '#1363DF', border: '1px solid black', color: 'white' }}> <HiLightBulb style={{ fontSize: '30px', marginBottom: '5px', color: 'yellow' }} /> HINT#2 : </div>
                                                    <div className='h6'  ><TbArrowForward style={{ fontSize: '30px' }} /> {props.riddle.hint2}</div>
                                                    <hr className='divider'></hr>
                                                </>
                                                :
                                                ""
                                            }
                                        </>
                                    </>
                                    :
                                    ""
                                }
                            </>
                        }

                    </Row>
                    <Row>
                        <>
                            {isAnswerWrong ?
                                ""
                                :
                                <>
                                    {props.isWinner ?
                                        ""
                                        :
                                        <>
                                            {riddleIsClosed ?
                                                <>
                                                    <IoAlertCircleSharp align="center" style={{ fontSize: '60px', marginBottom: '10px', color: 'red' }} />
                                                    <Row align="center" className="mb-4">

                                                        <div style={{ marginLeft: '20px', fontVariant: 'small-caps', fontSize: '20px', fontWeight: 'bold', color: 'red', textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white' }}>Riddle is closed!</div>

                                                    </Row>
                                                </>
                                                :
                                                ""
                                            }
                                        </>
                                    }
                                </>

                            }
                        </>
                    </Row>
                    {neverAnswered ?
                        <Row ></Row>
                        :
                        <>
                            {checkIfIdIsInside(props.riddle.id) ?
                                <Row ></Row>
                                :
                                <>
                                    {props.riddle.status === "closed" ?
                                        <Row ></Row>
                                        :
                                        <>
                                            {isAnswerWrong ?
                                                <Row >{isAnswerWrong}</Row>
                                                :
                                                <RiddleTimer key={props.riddle.id} isClosed={false} riddleID={props.riddle.id} duration={props.riddle.duration} time={time} setTime={setTime} showHint1={showHint1} showHint2={showHint2} isOpenPostedRiddle={isOpenPostedRiddle} />
                                            }
                                        </>
                                    }
                                </>
                            }

                        </>
                    }
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId='username'>
                            {checkIfIdIsInside(props.riddle.id) ?
                                <Row></Row>
                                :
                                <>
                                    {props.isWinner ?
                                        <>
                                            <Form.Label className="h4">Your answer :</Form.Label>
                                            <Form.Control type='text' placeholder={answer} disabled style={{ border: '1px black solid' }} value={answer} />
                                        </>
                                        :
                                        <>
                                            {isAnswerWrong ?
                                                <>
                                                    <Form.Label className="h4">Your answer :</Form.Label>
                                                    <Form.Control type='text' placeholder={answer} disabled style={{ border: '1px black solid' }} value={answer} />
                                                </>
                                                :
                                                <>
                                                    {props.riddle.status !== "closed" ?
                                                        <Form.Control type='text' placeholder='Your answer' style={{ border: '1px black solid' }} value={answer} onChange={ev => setAnswer(ev.target.value)}
                                                            required={true} />
                                                        :
                                                        <Form.Control type='text' disabled placeholder={answer} style={{ border: '1px black solid' }} value={answer} onChange={ev => setAnswer(ev.target.value)} />
                                                    }
                                                </>
                                            }
                                        </>
                                    }
                                </>
                            }


                        </Form.Group>
                        <br />
                        <br />

                        {props.isWinner ?
                            <>
                                <Row> <Col className="mb-3" align="center" style={{ fontVariant: 'small-caps', fontSize: '20px', fontWeight: 'bold', color: 'black', textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white' }}> Congratulations! Your answer is correct!</Col></Row>
                                <Row className="mb-3"><Col className="waviy" align="center">
                                    {(props.riddle.difficulty === "easy") ? <span className="waviy h5" style={{ textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black', color: '#00ff08' }}> +1 point gained!</span> : ""}
                                    {(props.riddle.difficulty === "average") ? <span className="waviy h5" style={{ textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black', color: '#00ff08' }}> +2 points gained!</span> : ""}
                                    {(props.riddle.difficulty === "difficult") ? <span className="waviy h5" style={{ textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black', color: '#00ff08' }}> +3 points gained!</span> : ""}
                                </Col></Row>
                            </>
                            :
                            <>
                                {isAnswerWrong ?
                                    <>
                                        <Row> <Col className="mb-3" align="center" style={{ fontVariant: 'small-caps', fontSize: '20px', fontWeight: 'bold', color: 'black', textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white' }}> Oops! Wrong answer!</Col></Row>
                                        <Row className="mb-3"><Col className="constant-tilt-shake" align="center">
                                            <div>
                                                <span className="constant-tilt-shake h5" style={{ textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black', color: '#FF3131' }}> 0 points gained!</span>
                                            </div>
                                        </Col></Row>
                                    </>
                                    :
                                    <>
                                        {checkIfIdIsInside(props.riddle.id) ?
                                            <Row> <Col className="mb-3" align="center" style={{ fontVariant: 'small-caps', fontSize: '20px', fontWeight: 'bold', color: 'black', textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white' }}>Already answered!</Col></Row>
                                            :
                                            <Row></Row>
                                        }
                                    </>
                                }
                            </>
                        }
                        <Row>
                            {checkIfIdIsInside(props.riddle.id) ?
                                <>

                                    <Col align="center">
                                        <Button onClick={() => { props.setAnswering(false); setIsAnswerWrong(false); props.setIsWinner(false); setAnswer(""); }} variant="dark" style={{ margin: '2px', fontSize: '20px' }}> <VscCloseAll /> Close </Button>
                                    </Col>
                                </>
                                :
                                <>
                                    {props.isWinner ?
                                        <>
                                            <Col align="center">
                                                <Button onClick={() => { props.setAnswering(false); setIsAnswerWrong(false); props.setIsWinner(false); setAnswer(""); }} variant="dark" style={{ margin: '2px', fontSize: '20px' }}> <VscCloseAll /> Close panel  </Button>
                                            </Col>
                                        </>
                                        :
                                        <>
                                            {isAnswerWrong ?
                                                <>
                                                    <Col align="center">
                                                        <Button onClick={() => { props.setAnswering(false); setIsAnswerWrong(false); props.setIsWinner(false); setAnswer(""); }} variant="dark" style={{ margin: '2px', fontSize: '20px' }}> <VscCloseAll /> Close  </Button>
                                                    </Col>
                                                </>
                                                :
                                                <>
                                                    <Col align="left">
                                                        <Button onClick={() => { props.setAnswering(false); setIsAnswerWrong(false); props.setIsWinner(false); setAnswer(""); }} variant="dark" style={{ margin: '2px', fontSize: '20px' }}> <VscCloseAll /> Close </Button>
                                                    </Col>
                                                    <Col align="right">
                                                        {riddleIsClosed ?
                                                            <Button disabled variant="success" style={{ fontSize: '20px' }}> Submit <MdOutlineQuestionAnswer /></Button>
                                                            :
                                                            <Button type="submit" variant="success" style={{ fontSize: '20px' }}> Submit <MdOutlineQuestionAnswer /></Button>
                                                        }

                                                        <div style={{ padding: '3px' }}></div>


                                                    </Col>
                                                </>
                                            }
                                        </>
                                    }
                                </>
                            }

                        </Row>
                    </Form>
                </Col>
            </Row >
        </Container >
    )
};

function EmptyAnswerForm(props) {
    return (
        <Container fluid>
            <Row className="justify-content-center fill">
                <Col sm={8} align="center" className="answer-form" style={{ marginTop: '15vw' }}>
                    <div className="empty-form-text" style={{ fontSize: '23px', color: 'black', backgroundColor: 'white', border: '1px solid black', padding: '5px' }}>
                        SELECT A RIDDLE ...
                    </div>
                    <div style={{ fontSize: '51px' }}>
                        <AiFillFileUnknown />
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

function AnswerEntries(props) {
    return (
        <Col>
            <AnswersTable answers={props.answers} />
        </Col>
    );
}

function AnswersTable(props) {

    const list = props.answers;

    return (
        <div className="align">
            <Table striped bordered hover size="lg" responsive="sm" variant="light" style={{ borderCollapse: 'collapse', borderBottom: '1px solid #808080' }}>
                <thead className='h5'>
                    <tr style={{ textAlign: 'center' }}>
                        <th className='table-column-title'>Answers</th>
                    </tr>
                </thead>
                <tbody style={{ backgroundColor: "#e6fae9" }}>
                    {list.map((a) => <AnswerRow answer={a} key={a.author} />)}
                </tbody>
            </Table>
        </div>
    );
}
function AnswerRow(props) {

    return (
        <>
            <tr className='align-middle'><AnswerData answer={props.answer} /></tr>
        </>
    );
}

function AnswerData(props) {

    return (
        <>
            <td className="table-content" >{props.answer.answer}</td>
        </>
    );
}

export { AnswerForm, AnswerEntries, EmptyAnswerForm };