var app = require('../index.js').app,
    mysql = require('../../mysql');

var util = require('../../../bin/util');

app.get('/v2/categories', function(req, res) {
  mysql.getConnection(function(err, connection) {
    if (err) throw err;

    connection.query('SELECT * from `nf_categories`;', function(err, rows) {
      if (rows.length < 1) {
        connection.release();

        return res.json({ message: 'No Categories Found', error: 'Not Found', status: 404 });
      }

      if (err) throw err;

      var categories = [];

      for (var i = 0; i < rows.length; i++) {
        categories.push({id: rows[i].id, name: rows[i].name, description: rows[i].description, created_at: rows[i].created_at, status: rows[i].status });
      }

      connection.release();

      return res.json({ categories: categories, total: categories.length});
    });
  });
});

app.put('/v2/categories', function(req, res) {
  if (!(req.body.id)) {
    return res.json({ message: 'Missing Parameter \'id\'.', error: 'Unprocessable Entity', status: 422 });
  }

  if (!(req.body.name)) {
    return res.json({ message: 'Missing Parameter \'name\'.', error: 'Unprocessable Entity', status: 422 });
  }

  if (!(req.body.description)) {
    return res.json({ message: 'Missing Parameter \'description\'.', error: 'Unprocessable Entity', status: 422 });
  }

  if (!(req.body.status)) {
    return res.json({ message: 'Missing Parameter \'status\'.', error: 'Unprocessable Entity', status: 422 });
  }

  mysql.getConnection(function(err, connection) {
    if (err) throw err;

    connection.query('SELECT * from `nf_categories` WHERE ?', {id: req.body.id}, function(err, rows) {
      if (err) throw err;

      if (rows.length < 1) {
        connection.release();

        return res.json({ message: 'Category Does Not Exist', error: 'Not Found', status: 404 });
      }

      connection.query('UPDATE `nf_categories` SET name = ?, description = ?, status = ? WHERE id = ?', [req.body.name, req.body.description, req.body.status, req.body.id], function(err, result) {
        if (err) throw err;

        connection.query('SELECT * from `nf_categories` WHERE ?', {id: req.body.id}, function(err, rows) {
          if (err) throw err;

          connection.release();

          return res.json({ id: rows[0].id, name: rows[0].name, description: rows[0].description, created_at: rows[0].created_at, status: rows[0].status });
        });
      });
    });
  });
});

app.post('/v2/categories', function(req, res) {
  if (!(req.body.name)) {
    return res.json({ message: 'Missing Parameter \'name\'.', error: 'Unprocessable Entity', status: 422 });
  }

  if (!(req.body.description)) {
    return res.json({ message: 'Missing Parameter \'description\'.', error: 'Unprocessable Entity', status: 422 });
  }

  if (!(req.body.status)) {
    return res.json({ message: 'Missing Parameter \'status\'.', error: 'Unprocessable Entity', status: 422 });
  }

  mysql.getConnection(function(err, connection) {
    if (err) throw err;

    connection.query('INSERT INTO `nf_categories` SET ?', {name: req.body.name, description: req.body.description, created_at: util.getISOStamp(), status: req.body.status}, function(err, result) {
      if (err) throw err;

      connection.query('SELECT * from `nf_categories` WHERE ?', {id: result.insertId}, function(err, rows) {
        if (err) throw err;

        connection.release();

        return res.json({ id: rows[0].id, name: rows[0].name, description: rows[0].description, created_at: rows[0].created_at, status: rows[0].status });
      });
    });
  });
});

app.delete('/v2/categories', function(req, res) {
  if (!(req.body.id)) {
    return res.json({ message: 'Missing Parameter \'id\'.', error: 'Unprocessable Entity', status: 422 });
  }

  mysql.getConnection(function(err, connection) {
    if (err) throw err;

    connection.query('SELECT * from `nf_categories` WHERE ?', {id: req.body.id}, function(err, rows) {
      if (err) throw err;

      if (rows.length < 1) {
        connection.release();

        return res.json({ message: 'Category Does Not Exist', error: 'Not Found', status: 404 });
      }

      connection.query('DELETE FROM `nf_categories` WHERE id = ?', [req.body.id], function(err, result) {
        if (err) throw err;

        connection.release();

        return res.send('');
      });
    });
  });
});
