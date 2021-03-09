import React from 'react';
import PropTypes from 'prop-types';

const splitEE = ([hd, ...tl], signed = [], unsigned = []) => {
  if (hd === undefined) return [signed, unsigned];
  if (hd.timeChosen) {
    signed.push(hd);
    return splitEE(tl, signed, unsigned);
  }
  unsigned.push(hd);
  return splitEE(tl, signed, unsigned);
};

const Details = (props) => {
  const { event } = props;

  const [assigned, unassigned] = splitEE(event.interviewees);

  console.log(assigned, unassigned);

  return (
    <>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
    </>
  );
};

Details.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    interviewees: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.string,
      }),
    ),
  }).isRequired,
};

export default Details;
