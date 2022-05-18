'use strict';

module.exports.solution = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Creando la infra con Serverless!',
        input: event,
      },
      null,
      2
    ),
  };
};
