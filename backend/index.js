const app = require('./server.js');
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useFindAndModify: false,
   useCreateIndex: true,
 }).then(() => console.log('Connected to MongoDB'));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
