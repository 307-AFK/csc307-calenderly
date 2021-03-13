# Use Cases

_last updated: 2021-02-08_

the use cases for the different types of actors within our application

[view diagram here](./imgs/use_cases.jpg)

## Actors and use cases

### Event Creator

The person that actually creates a new event. After creating an event, they
are treated as an interviewer within that event.

### Interviewer

The people who are in charge of the event. The following user stories apply to
them.

- account creation/login
- ability to share event
- view scheduled interviews (as well as swap and schedule shifts)

### Interviewee

The people signing up for an event. They should be able to do the following

- sign up for events (cannot overlap with existing interviewers; this will
notify interviewers)
