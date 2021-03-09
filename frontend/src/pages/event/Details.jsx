import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Avatar,
  Tooltip,
  PageHeader,
  Divider,
  Row,
  Col,
  Button,
} from 'antd';

import UserCard from '../../components/UserCard';
import styles from '../../styles/EventDetails.module.css';

// divides Viewees between scheduled and not scheduled
const splitEE = ([hd, ...tl], signed = [], unsigned = []) => {
  if (hd === undefined) return [signed, unsigned];
  if (hd.timeChosen) {
    signed.push(hd);
    return splitEE(tl, signed, unsigned);
  }
  unsigned.push(hd);
  return splitEE(tl, signed, unsigned);
};

// partitions scheduled by day
const partByDay = (scheduled) => {
  const days = {};

  scheduled.forEach((e) => {
    const day = e.timeChosen.substr(0, 10);
    if (days[day] === undefined) days[day] = [];
    days[day].push(e);
  });

  const dayPairs = Object.keys(days).map((k) => ({ date: k, views: days[k] }));
  const sortedDays = dayPairs.sort((a, b) => a.date > b.date);

  return sortedDays;
};

const InterviewButton = ({ isAvail, viewerList, info }) => {
  const [viewers, setViewers] = useState(viewerList);
  const baseURL = `${process.env.REACT_APP_SERVER_URL}/events`;

  const addViewer = () => {
    fetch(`${baseURL}/${info.eventId}/${info.viewId}/interview`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ viewerid: info.profile.id }),
    }).then(() => {
      const prof = {
        _id: info.profile.id,
        name: info.profile.name,
        picture: info.profile.picture,
      };

      setViewers([...viewers, prof]);
    });
  };

  return (
    <>
      <Col span={4}>
        <Avatar.Group>
          {viewers && viewers.map((v) => (
            <Tooltip key={v._id} title={v.name} placement='bottom'>
              <Avatar src={v.picture} />
            </Tooltip>
          ))}
        </Avatar.Group>
      </Col>
      <Col span={3}>
        <Button
          block
          disabled={!isAvail}
          type='primary'
          onClick={addViewer}
        >
          Interview
        </Button>
      </Col>
    </>
  );
};

const VieweeTile = (props) => {
  const {
    eventId,
    viewId,
    profile,
    datetime,
    user,
    viewer,
    viewers,
  } = props;

  const time = datetime.split('T00:')[1];
  const timeString = time.substring(0, 5);

  if (!viewer) {
    return (
      <Col span={24}>
        <UserCard picture={user.picture} name={user.name}>
          <span>{`${user.name} - `}</span>
          <b>{timeString}</b>
        </UserCard>
      </Col>
    );
  }

  const timeIndex = +(time.split(':')[0]) - 9;
  const isAvail = viewer[0].times[timeIndex];
  const btnInfo = { eventId, viewId, profile };

  return (
    <>
      <Col span={17}>
        <UserCard picture={user.picture} name={user.name}>
          <span>{`${user.name} - `}</span>
          <b>{timeString}</b>
        </UserCard>
      </Col>

      <InterviewButton isAvail={isAvail} viewerList={viewers} info={btnInfo} />
    </>
  );
};

const ViewDay = (props) => {
  const {
    eventId,
    profile,
    day,
    views,
    viewer,
  } = props;

  return (
    <>
      <Col span={24}>
        <h4 className={styles.dayHeading}>{day}</h4>
      </Col>
      { /* TODO surely this can be cleaned up */
        views.map((user) => (
          <VieweeTile
            key={user._id}
            eventId={eventId}
            viewId={user._id}
            profile={profile}
            user={user.userId}
            datetime={user.timeChosen}
            viewer={viewer}
            viewers={user.interviewers}
          />
        ))
      }
    </>
  );
};

const VieweePanel = (props) => {
  const {
    eventId,
    profile,
    viewees,
    viewerAvail,
  } = props;

  const [assigned, unassigned] = splitEE(viewees);
  const days = partByDay(assigned);

  return (
    <>
      <h3>Interviewees Signed Up</h3>
      <Row>
        { assigned.length > 0
          ? days.map((day) => (
            <ViewDay
              key={day.date}
              eventId={eventId}
              profile={profile}
              day={day.date}
              views={day.views}
              viewer={viewerAvail && viewerAvail.filter((d) => (
                d.date.substr(0, 10) === day.date
              ))}
            />
          )) : <em>No interviewees have signed up yet</em>}
      </Row>

      <Divider />
      <h3>Interviewees Not Signed Up</h3>
      { unassigned.length > 0 ? (
        <Avatar.Group>
          {unassigned.map((user) => (
            <Tooltip key={user._id} title={user.userId.name} placement='bottom'>
              <Avatar src={user.userId.picture} />
            </Tooltip>
          ))}
        </Avatar.Group>
      ) : <em>All Interviewees have signed up</em> }
    </>
  );
};

const Details = (props) => {
  const { profile, event } = props;

  const startdate = event.startDate.substr(0, 10);
  const enddate = event.startDate.substr(0, 10);

  const findViewer = event.interviewers.find((u) => u.userId === profile.id);
  const viewerAvail = findViewer ? findViewer.availability : null;
  const vieweeCount = event.interviewees.length;

  return (
    <>
      <PageHeader title={event.title} />

      <div className='content'>
        <p>{`${startdate} → ${enddate}`}</p>
        <p>{event.description}</p>

        <Divider />
        <h2>Interviewees</h2>
        {vieweeCount > 0
          ? (
            <VieweePanel
              eventId={event._id}
              profile={profile}
              viewees={event.interviewees}
              viewerAvail={viewerAvail}
            />
          ) : <em>There are currently no interviewees</em>}
      </div>
    </>
  );
};

InterviewButton.propTypes = {
  isAvail: PropTypes.bool.isRequired,
  viewerList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      picture: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  info: PropTypes.shape({
    eventId: PropTypes.string.isRequired,
    viewId: PropTypes.string.isRequired,
    profile: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      picture: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

VieweeTile.propTypes = {
  eventId: PropTypes.string.isRequired,
  viewId: PropTypes.string.isRequired,
  profile: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
  }).isRequired,
  datetime: PropTypes.string.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
  }).isRequired,
  viewer: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      times: PropTypes.arrayOf(PropTypes.bool).isRequired,
    }),
  ).isRequired,
  viewers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      picture: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};

ViewDay.propTypes = {
  eventId: PropTypes.string.isRequired,
  profile: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
  }).isRequired,
  day: PropTypes.string.isRequired,
  views: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      picture: PropTypes.string.isRequired,
    }),
  ).isRequired,
  viewer: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      times: PropTypes.arrayOf(PropTypes.bool).isRequired,
    }),
  ).isRequired,
};

VieweePanel.propTypes = {
  eventId: PropTypes.string.isRequired,
  profile: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
  }).isRequired,
  viewees: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.shape({
        _id: PropTypes.string.isRequired,
      }),
    }),
  ).isRequired,
  viewerAvail: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      times: PropTypes.arrayOf(PropTypes.bool).isRequired,
    }),
  ).isRequired,
};

Details.propTypes = {
  profile: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
  }).isRequired,
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    interviewees: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.shape({
          _id: PropTypes.string.isRequired,
        }),
        interviewers: PropTypes.arrayOf(
          PropTypes.shape({
            _id: PropTypes.string.isRequired,
          }),
        ),
      }),
    ),
    interviewers: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.shape({
          _id: PropTypes.string.isRequired,
        }),
      }),
    ),
  }).isRequired,
};

export default Details;
