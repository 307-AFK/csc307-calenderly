import React from 'react';
import PropTypes from 'prop-types';
import { Row, Space } from 'antd';

import Card from './Card';
import ButtonLink from './ButtonLink';

const EventCard = (props) => {
  const { event, isInterviewer } = props;
  const linkBase = `event/${event.eventId}`;

  return (
    <Card width={24}>
      <Row justify='space-between' align='middle'>
        <Space>
          <p>
            event:
            {event.eventId}
          </p>
        </Space>

        <Space>
          { isInterviewer && (
            <ButtonLink link={`${linkBase}/update`}>Update Event</ButtonLink>
          )}
          <ButtonLink link={`${linkBase}/availability`}>
            Set Availability
          </ButtonLink>
        </Space>
      </Row>
    </Card>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    eventId: PropTypes.string.isRequired,
  }).isRequired,
  isInterviewer: PropTypes.bool,
};

EventCard.defaultProps = {
  isInterviewer: false,
};

export default EventCard;
