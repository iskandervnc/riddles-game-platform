import { Container, Dropdown, Navbar } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import { IoLogInOutline } from 'react-icons/io5'
import { BiLogOut } from 'react-icons/bi'
import logo from "../resources/logo.png";

function TopBar(props) {
    const userColor = '#FFD24C';
    return (
        <Navbar style={{ backgroundColor: props.bg }} expand="lg"
            className="justify-content-center align-content-center mh-10">
            <Container style={{ paddingTop: '0.2%', marginLeft: '3vw', marginRight: '3vw' }}>

                <Navbar.Brand href='/'>
                    <img src={logo} alt={"App logo"} height={60} width={60} />
                    <span className="logo-text" style={{ color: 'white', fontFamily: 'FreeMono, monospace' }}> SolveMyRiddle! </span>
                </Navbar.Brand>

                <Navbar.Collapse className="justify-content-end" style={{ marginRight: '5px' }}>
                    <Navbar.Text style={{ fontSize: '20px', color: '#ffffff' }}>
                        {props.topBarText}
                    </Navbar.Text>
                </Navbar.Collapse>


                <Dropdown align={'end'}>

                    <Dropdown.Toggle as={PersonCircle} size={'50px'} style={{
                        paddingRight: 0,
                        borderRadius: '50%',
                        cursor: 'pointer',
                        backgroundColor: userColor,
                        color: 'white'
                    }} />

                    <Dropdown.Menu>
                        {props.loggedIn ?
                            <Dropdown.Item onClick={props.logOut} style={{ fontSize: '22px' }}> <BiLogOut /> Logout </Dropdown.Item>
                            : <><Dropdown.Header>You are not logged in</Dropdown.Header>
                                <Dropdown.Divider />
                                <Dropdown.Item href="/solveMyRiddle/login" style={{ fontSize: '22px' }}> Login  <IoLogInOutline /></Dropdown.Item>
                            </>}
                    </Dropdown.Menu>
                </Dropdown>
            </Container>
        </Navbar>
    );
}

function TopBarLoggingIn(props) {
    const userColor = '#39AEA9';
    return (
        <Navbar style={{ backgroundColor: props.bg }} expand="lg"
            className="justify-content-center align-content-center mh-10">
            <Container style={{ paddingTop: '0.2%', marginLeft: '3vw', marginRight: '3vw' }}>
                <Navbar.Brand href='/'>
                    <img src={logo} alt={"App logo"} height={60} width={60} style={{ marginBottom: '3%' }} />
                    <span className="logo-text" style={{ color: 'white', marginLeft: '0em', fontFamily: 'FreeMono, monospace' }}> SolveMyRiddle! </span>
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export { TopBar, TopBarLoggingIn };