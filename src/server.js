const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, handler) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    handler(request, response, bodyParams);
  });
};

const handlePost = (request, response, paresedURL) => {
  if (paresedURL.pathname === '/addUser') {
    parseBody(request, response, jsonHandler.addUser);
  }
};
const handleGet = (request, response, paresedURL) => {
  if (paresedURL.pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else if (paresedURL.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (paresedURL.pathname === '/getUsers') {
    jsonHandler.getUsers(request, response);
  } else {
    jsonHandler.notReal(request, response);
  }
};
const handleHead = (request, response, paresedURL) => {
  if (paresedURL.pathname === '/getUsers') {
    jsonHandler.getUsersMeta(request, response);
  } else if (paresedURL.pathname === '/notReal') {
    jsonHandler.notRealMeta(request, response);
  }
};

const onRequest = (request, response) => {
  const parsedURL = url.parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedURL);
  } else if (request.method === 'GET') {
    handleGet(request, response, parsedURL);
  } else if (request.method === 'HEAD') {
    handleHead(request, response, parsedURL);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
