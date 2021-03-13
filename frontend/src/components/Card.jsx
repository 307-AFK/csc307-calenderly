import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col } from 'antd';
import '../styles/Card.less';

const Card = (props) => {
  const { width, children, page } = props;
  const cardClass = `card ${page ? 'page' : 'hover'}`;

  return (
    <Row justify='center'>
      <Col md={width} sm={18} xs={20} className={cardClass}>
        { children }
      </Col>
    </Row>
  );
};

Card.propTypes = {
  width: PropTypes.number,
  children: PropTypes.element.isRequired,
  page: PropTypes.bool,
};

Card.defaultProps = {
  width: 18,
  page: false,
};

export default Card;
