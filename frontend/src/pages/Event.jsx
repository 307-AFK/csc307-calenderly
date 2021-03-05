import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Switch,
  Route,
  useParams,
  useRouteMatch,
} from 'react-router-dom';

import Availability from './event/Availability';
import TimeSlotSelect from './event/TimeSlotSelect';

const getUserAvail = (userId, avails) => {
  const avail = avails.filter((a) => a.userId === userId);
  return avail[0];
};

const Event = (props) => {
  const { user } = props;
  const match = useRouteMatch();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  let userAvail = null;

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/events/${id}`,
      { credentials: 'include' })
      .then((res) => res.json())
      .then((e) => setEvent(e));
  }, []);

  if (event) {
    userAvail = getUserAvail(user.id,
      event.interviewers.concat(event.interviewees));
  }

  return (
    <Switch>
      <Route path={`${match.path}/availability`}>
        {userAvail && (userAvail.availability ? (
          <Availability
            eventId={id}
            avail={userAvail.availability}
            availId={userAvail._id}
          />
        )
          : (
            <TimeSlotSelect
              eventId={id}
              interviewers={event.interviewers}
              interviewersNeeded={event.interviewersNeeded}
            />
          ))}
      </Route>
    </Switch>
  );
};

Event.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
};

export default Event;
