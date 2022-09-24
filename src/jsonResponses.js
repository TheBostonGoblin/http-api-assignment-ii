const users = {};
const respondJSON = (request, response, status, content) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(content));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};
const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  return respondJSON(request, response, 200, responseJSON);
};
const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);
const addUser = (request, response, body) => {
  if (!body.name || !body.age) { // Error parameters not given
    const responseJSON = {
      message: 'name and age are required to add a user',
      id: 'missingParameters',
    };
    return respondJSON(request, response, 400, responseJSON);
  }
  if (!users[body.name]) {
    const responseJSON = { // creating a new user
      message: 'Created Successfully',
    };
    users[body.name] = {};
    users[body.name].name = body.name;
    users[body.name].age = body.age;
    return respondJSON(request, response, 201, responseJSON);
  }
  // updating a previous user
  users[body.name].name = body.name;
  users[body.name].age = body.age;
  return respondJSONMeta(request, response, 204);
};

const notReal = (request, response) => {
  const responseJSON = {
    message: 'the page you are looking for is not found',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseJSON);
};

const notRealMeta = (request, response) => respondJSONMeta(request, response, 404);

module.exports = {
  getUsers,
  getUsersMeta,
  addUser,
  notReal,
  notRealMeta,

};
