import {Container, Row} from 'react-bootstrap';

function NotFoundPage() {
    return (
        <Container className="p-3 rounded">
            <Row>
                <h1>401 Нужна Авторизация</h1>
            </Row>
        </Container>
    );
}

export default NotFoundPage;
