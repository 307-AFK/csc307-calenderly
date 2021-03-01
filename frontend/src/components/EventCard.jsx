import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import Card from './Card';

const EventCard = (props) => {
  const { event, isInterviewer } = props;
  if (isInterviewer) {
    return (
      <Card width={8}>
        <>
          event:
          {event.eventId}
          <br />
          <Button>
            Update Event
          </Button>
          <Button>
            Set Availability
          </Button>
        </>
      </Card>
    );
  }
  return (
    <Card width={8}>
      <>
        event:
        {event.eventId}
        <Button>
          Set Availability
        </Button>
      </>
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
