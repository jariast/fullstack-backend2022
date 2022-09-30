const errorHandler = (error, request, response, next) => {
  console.log('HANDLING ERROR');
  console.log(error.message);

  switch (error.name) {
    case 'CastError':
      return response.status(400).send({ error: 'ID is using wrong format' });
    case 'InvalidContact':
      return response.status(400).send({ error: error.message });
    default:
      break;
  }

  next(error);
};

module.exports = errorHandler;
