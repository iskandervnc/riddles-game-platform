import { useState } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { MdOutlineCancel } from 'react-icons/md'
import { BiLogInCircle } from 'react-icons/bi'

function LoginForm(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const credentials = { username, password };
        props.login(credentials);
    };

    return (
        <Container fluid className="login-form-whole-page ">
            <Row className="justify-content-center fill">
                <Col sm={3} align="left" className="login-form" style={{ marginTop: '5vw' }}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId='username'>
                            <Form.Label style={{ color: 'white' }}>Username</Form.Label>
                            <Form.Control type='text' value={username} onChange={ev => setUsername(ev.target.value)}
                                required={true} />
                        </Form.Group>
                        <br />
                        <Form.Group controlId='password'>
                            <Form.Label style={{ color: 'white' }}>Password</Form.Label>
                            <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)}
                                required={true}
                                minLength={6} />
                        </Form.Group>
                        <br />
                        <Row>
                            <Col align="left">
                                <Button type="submit" variant="dark" style={{ fontSize: '22px' }}>Login <BiLogInCircle /></Button>

                            </Col>
                            <Col align="right">
                                <Button href="/" variant="light" style={{ fontSize: '22px' }}> <MdOutlineCancel /> Cancel</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
};

export { LoginForm };