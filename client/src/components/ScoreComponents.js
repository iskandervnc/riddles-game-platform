import { Col, Table } from 'react-bootstrap';

function ScoreEntries(props) {
    return (
        <Col>
            <ScoresTable users={props.users} />
        </Col>
    );
}

function ScoresTable(props) {
    const list = props.users;
    return (
        <div className="align">
            <Table striped bordered hover size="sm" responsive="sm" variant="dark" style={{ borderCollapse: 'collapse', borderBottom: '1px solid #808080' }}>
                <thead className='h5'>
                    <tr style={{ textAlign: 'center' }}>
                        <th className='table-column-title-rank glow'>#</th>
                        <th className='table-column-title-rank glow'> Top 3 Ranked Users</th>
                        <th className='table-column-title-rank glow'> Score </th>
                    </tr>
                </thead>
                <tbody style={{ backgroundColor: "#e6fae9" }}>
                    {list.map((u) => <ScoreRow user={u} key={u.username} />)}
                </tbody>
            </Table>
        </div>
    );
}
function ScoreRow(props) {

    return (
        <>
            <tr className='align-middle'><ScoreData user={props.user} /></tr>
        </>
    );
}

function ScoreData(props) {

    return (
        <>
            {props.user.rank === 1 ?
                <>
                    <td className="table-content-rank" style={{ textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black', color: '#FFD700' }}>1<sup>st</sup></td>
                    <td className="table-content-rank glow-rank" style={{ textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black', color: '#FFD700' }}>{props.user.username}</td>
                </>
                :
                <>
                    {props.user.rank === 2 ?
                        <>
                            <td className="table-content-rank" style={{ textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black', color: '#C0C0C0' }}>2<sup>nd</sup></td>
                            <td className="table-content-rank" style={{ textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black', color: '#C0C0C0' }}>{props.user.username}</td>
                        </>
                        :
                        <>
                            {props.user.rank === 3 ?
                                <>
                                    <td className="table-content-rank" style={{ textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black', color: '#cd7f32' }}>3<sup>rd</sup></td>
                                    <td className="table-content-rank" style={{ textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black', color: '#cd7f32' }}>{props.user.username}</td>
                                </>
                                :
                                ""
                            }
                        </>
                    }
                </>
            }
            <td className="table-content-rank-score" style={{ textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black', color: 'white' }}>{props.user.score}</td>
        </>
    );
}

export { ScoreEntries }