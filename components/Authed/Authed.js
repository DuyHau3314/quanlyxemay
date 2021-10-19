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

      <div className={classes.fixed}>
        <button className="btn btn-primary">Đồng bộ</button>
        <button className="btn btn-primary mt-3">Khôi phục</button>
      </div>
    </div>
  );
};

export default Authed;
