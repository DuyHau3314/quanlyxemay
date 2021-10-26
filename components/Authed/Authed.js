import Cokhi from '../Cokhi/Cokhi';
import Nhua from '../Nhua/Nhua';
import classes from './Authed.module.css';
import { Container, Row, Col } from 'react-bootstrap';
const Authed = () => {
  return (
    <div className={classes.authed}>
      <Container className="mt-5">
        <Row>
          <Col sm={12} md={6}>
            <Cokhi />
          </Col>
          <Col sm={12} md={6}>
            <Nhua />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Authed;
