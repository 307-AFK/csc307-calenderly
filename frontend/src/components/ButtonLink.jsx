import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from 'antd';

const ButtonLink = (props) => {
  const { link, children } = props;

  return (
    <Link to={link}>
      <Button>{children}</Button>
    </Link>
  );
};

ButtonLink.propTypes = {
  children: PropTypes.node.isRequired,
  link: PropTypes.string.isRequired,
};

export default ButtonLink;
