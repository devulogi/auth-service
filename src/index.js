const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

const rootRouter = require('./routes/root.routes');
const { errorHandler, notFoundHandler } = require('./middlewares');

dotenv.config();

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api', rootRouter);

app.use(errorHandler);

app.use(notFoundHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
