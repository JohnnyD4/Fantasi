var Chart = require('chart.js');
var mysql      = require('mysql');

// creates connection to mysql database
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'fantasy'
});

connection.connect(function(err) {
	if(err) {
		throw err
	}
	console.log('Connected!')
});

connection.query('SELECT ')
