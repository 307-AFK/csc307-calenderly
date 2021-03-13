import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Row, Space } from 'antd';

import Card from './Card';
import ButtonLink from './ButtonLink';

const EventCard = (props) => {
  const { event, isInterviewer } = props;
  const linkBase = `event/${event._id}`;

  return (
    <Card width={24}>
      <Row justify='space-between' align='middle'>
        <Space>
          <Link to={linkBase}>
            <u>
              {event.title}
              {event.description && ` -  ${event.description}`}
            </u>
          </Link>
        </Space>

        <Space>
          { isInterviewer ? (
            <>
              <ButtonLink link={`${linkBase}/update`}>Update Event</ButtonLink>
              <ButtonLink link={`${linkBase}/availability`}>
                Set Availability
              </ButtonLink>
            </>
          ) : (
            <ButtonLink link={`${linkBase}/availability`}>
              Select Timeslot
            </ButtonLink>
          )}
        </Space>
      </Row>
    </Card>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  isInterviewer: PropTypes.bool,
};

EventCard.defaultProps = {
  isInterviewer: false,
};

export default EventCard;
