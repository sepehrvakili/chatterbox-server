var fs = require('fs');
var dataPath = __dirname + '/data.txt';

console.log('dirname is=>>>>', __dirname);


var data = {
  results: [
    {username: 'Jono', message: 'Do my bidding!', roomname: 'Lobby'},
    {username: 'Tim', message: 'Do my bidding!', roomname: 'Lobby'}
  ]
};

// writeData
var stringed = JSON.stringify(data.results);
console.log(stringed);
stringed = stringed.slice(1, stringed.length - 1);

console.log(stringed);
// fs.writeFileSync(dataPath, JSON.stringify(data.results));
// fs.appendFileSync(dataPath, JSON.stringify(data.results));
// fs.appendFileSync(dataPath, JSON.stringify(data.results));
// readData

var readData = [];
fs.readFile(dataPath, 'utf8', (error, data) => {
  // at this point data has already been read...
  var allData = JSON.parse(data);
  for ( var i = allData.length - 1; i > allData.length - 15 && i > -1; i-- ) {
    readData.push(allData[i]);
  }
});
setTimeout(() => { console.log('====>> readData content is:=====> ', readData); }, 2000);

// var readBuffer = ;

// 


var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = 'JSON';

  if ( request.url !== '/classes/messages') {
    response.writeHead(404, headers);
    response.end('This page does not exit');
  }

  if ( request.method === 'OPTIONS' ) {
    response.writeHead(200, headers);
    response.end();
  }

  if ( request.method === 'GET' ) {
    response.writeHead(200, headers);
    // data.results.reverse();
    response.end(JSON.stringify(data));
  }

  if ( request.method === 'POST' ) {
    var body = '';

    request.on('data', function (data) {
      body += data;
    });

    request.on('end', function () {
      var post = JSON.parse(body);
      response.writeHead(201, headers);
      data.results.push(post);
      response.end(JSON.stringify(post));
    });
  }

};

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

exports.requestHandler = requestHandler;

/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

 // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
