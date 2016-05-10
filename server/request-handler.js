var fs = require('fs');
var dataPath = __dirname + '/data.txt';
var pathModule = require('path');

var stringifity = function(array) { 
// this func takes in an array of objects and returns
// a stringified json object without the starting
// or ending [ brackets ]
  var stringed = JSON.stringify(array);
  return stringed.slice(1, stringed.length - 1);
};

// process.chdir('../');
// console.log(process.cwd());
// console.log('DIRNAME IS =====>>>>', __dirname);
// var dirname = __dirname.slice();
// var html = fs.readFileSync();


var writeBuffer = [
  {username: 'Jono', message: 'Do my bidding!', roomname: 'Lobby'}
];
var readBuffer = [];

var writeToFile = function() {
  if ( writeBuffer.length > 0 ) {
    fs.appendFileSync(dataPath, ( stringifity(writeBuffer) + ',') );
    writeBuffer = [];
  } 
};

var readFromFile = function(numOfMessages) {
  fs.readFile(dataPath, 'utf8', (error, data) => {
    // at this point data has already been read...
    // set readBuffer to empty since we want 
    readBuffer = [];
    // remove the trailing comma so JSONstringify will accept input
    data = data.slice(0, data.length - 1);
    var allData = JSON.parse('[' + data + ']');
    for ( var i = allData.length - 1; i > allData.length - numOfMessages && i > -1; i-- ) {
      readBuffer.push(allData[i]);
    }
  }); 
};

// setInterval(() => { console.log('====>> readBuffer content is:=====> ', readBuffer); }, 2000);
setInterval(() => {
  writeToFile();
  readFromFile(15);
}, 500);

var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = 'JSON';

  var serveStatic = function(requestUrl) {
    var path = process.cwd() + '/client/' + requestUrl;
    var file = fs.readFileSync(path);
    var contentType = '';
    var ext = pathModule.extname(path);
    switch (ext) {
    case '.html':
      contentType = {'Content-Type': 'text/html'};
      break;
    case '.js':
      contentType = {'Content-Type': 'text/javascript'};
      break;
    case '.css':
      contentType = {'Content-Type': 'text/css'};
      break;
    case '.gif':
      contentType = {'Content-Type': 'image/gif'};
      break;
    }
    response.writeHead(200, contentType);
    response.end(file);
  };

  if ( request.url === '/' || request.url === '' ) {
    serveStatic('index.html');
  }

  if ( request.url.includes('css') || request.url.includes('js') || request.url.includes('gif') || request.url.includes('html') ) {
    serveStatic(request.url);
  }

  if ( request.url !== '/classes/messages' ) {
    response.writeHead(404, headers);
    response.end('This page does not exit');
  }

  if ( request.method === 'OPTIONS' ) {
    response.writeHead(200, headers);
    response.end();
  }

  if ( request.method === 'GET' ) {
    response.writeHead(200, headers);
    response.end(JSON.stringify({results: readBuffer}));
  }

  if ( request.method === 'POST' ) {
    var body = '';

    request.on('data', function (data) {
      body += data;
    });

    request.on('end', function () {
      var post = JSON.parse(body);
      response.writeHead(201, headers);
      writeBuffer.push(post);
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

// // append Data
// // Update File with data in the Write Buffer 
// fs.appendFileSync(dataPath, ( stringifity(writeBuffer) + ',') );

// var readBuffer = [];
// fs.readFile(dataPath, 'utf8', (error, data) => {
//   // at this point data has already been read...
//   // remove the trailing comma so JSONstringify will accept input
//   data = data.slice(0, data.length - 1);
//   var allData = JSON.parse('[' + data + ']');
//   for ( var i = allData.length - 1; i > allData.length - 15 && i > -1; i-- ) {
//     readBuffer.push(allData[i]);
//   }
// });
