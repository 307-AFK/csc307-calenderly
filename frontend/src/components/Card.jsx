import { Row, Col } from 'antd';
import '../styles/Card.less';

const Card = (props) => (
  <Row justify='center'>
    <Col md={ props.width } sm={18} xs={20} className='card'>
      { props.children }
    </Col>
  </Row>
);

export default Card;
