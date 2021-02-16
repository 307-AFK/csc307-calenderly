import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col } from 'antd';
import '../styles/Card.less';

const Card = (props) => {
  const { width, children } = props;

  return (
    <Row justify="center">
      <Col md={width} sm={18} xs={20} className="card">
        { children }
      </Col>
    </Row>
  );
};

Card.propTypes = {
  width: PropTypes.number,
  children: PropTypes.element.isRequired,
};

Card.defaultProps = {
  width: 18,
};

export default Card;
