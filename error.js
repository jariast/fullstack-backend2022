const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  switch (error.name) {
    case 'CastError':
      return response.status(400).send({ error: 'ID is using wrong format' });
    case 'InvalidContact':
      return response.status(400).send({ error: error.message });
    case 'ValidationError':
      return response.status(400).send({ error: error.message });
    case 'MongoServerError':
      return response.status(400).send({ error: error.message });
    default:
      break;
  }

  console.log('Undhandled ERROR: ', error);

  next(error);
};

module.exports = errorHandler;
