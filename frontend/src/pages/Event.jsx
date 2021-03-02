import React from 'react';
import {
  Switch,
  Route,
  useParams,
  useRouteMatch,
} from 'react-router-dom';

import Availability from './event/Availability';

const Event = () => {
  const match = useRouteMatch();
  const { id } = useParams();

  console.log(id);

  return (
    <Switch>
      <Route path={`${match.path}/availability`}>
        <Availability />
      </Route>
    </Switch>
  );
};

export default Event;
