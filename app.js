require('pmx').init({
  http : true
});

var http = require('http');
var url = require('url');
var request = require('request');
var config = require('config');

http.createServer(onRequest).listen(80);

var ips = config.get('ips');

console.log('Loading on IPs: ' + ips);

function onRequest(req, res) {

    var queryData = url.parse(req.url, true).query;   
      
    var ip = ips[Math.floor(Math.random() * ips.length)];
   
    console.log('Proxying on ip: ' + ip + ' -- ' + req.url);
    
    if (queryData.url) {
        var internalRequest = request({
            url: queryData.url,
	    family: 6,
	    localAddress: ip,	   
            headers: config.get('headers')[0]
        });
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
	internalRequest
	  .on('error', function(e) {
           console.log('error: '+ e);
	   res.statusCode = 500;
	   res.end('error 500');	    
          })
	  .pipe(res);
    }
    else {
        //res.end('No url found');
	res.end('loaderio-1e4ac91768b2952d177a51207bc4e3ac');
    }
}

