import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Switch,
  Route,
  useParams,
  useRouteMatch,
} from 'react-router-dom';

import UpdateEvent from './UpdateEvent';

import EventDetails from './event/Details';
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
  const [userAvail, setAvail] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/events/${id}`,
      { credentials: 'include' })
      .then((res) => res.json())
      .then((e) => setEvent(e));
  }, []);

  if (event && userAvail === null) {
    const avail = getUserAvail(user.id,
      event.interviewers.concat(event.interviewees));
    setAvail(avail);
  }

  return (
    <Switch>
      <Route path={`${match.path}/`} exact>
        {event && <EventDetails event={event} />}
      </Route>
      <Route path={`${match.path}/availability`}>
        {userAvail && (userAvail.availability ? (
          <Availability
            eventId={id}
            avail={userAvail.availability}
            // eslint-disable-next-line no-underscore-dangle
            availId={userAvail._id}
          />
        ) : (
          <TimeSlotSelect event={event} userId={user.id} />
        ))}

        {/* TODO this is broken. Clean up ASAP */}
        {event && !userAvail && <TimeSlotSelect event={event} userId={user.id} />}
      </Route>
      <Route path={`${match.path}/update`}>
        <UpdateEvent user={user} />
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
