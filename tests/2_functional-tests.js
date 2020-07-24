/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

let testID;

suite('Functional Tests', function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test('#example Test GET /api/books', function (done) {
    chai
      .request(server)
      .get('/api/books')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(
          res.body[0],
          'commentcount',
          'Books in array should contain commentcount'
        );
        assert.property(
          res.body[0],
          'title',
          'Books in array should contain title'
        );
        assert.property(
          res.body[0],
          '_id',
          'Books in array should contain _id'
        );
        testID = res.body[0]._id;
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite('Routing tests', function () {
    suite(
      'POST /api/books with title => create book object/expect book object',
      function () {
        test('Test POST /api/books with title', function (done) {
          chai
            .request(server)
            .post('/api/books')
            .send({ title: 'false' })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isObject(res.body);
              assert.property(
                res.body,
                '_id',
                'Object should contain _id of book'
              );
              assert.property(
                res.body,
                'title',
                'Object should contain title of book'
              );
              assert.property(
                res.body,
                'comments',
                'Object should contain comments of book'
              );
              done();
            });
        });

        test('Test POST /api/books with no title given', function (done) {
          chai
            .request(server)
            .post('/api/books')
            .send({})
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'missing title');
              done();
            });
        });
      }
    );

    suite('GET /api/books => array of books', function () {
      test('Test GET /api/books', function (done) {
        chai
          .request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(
              res.body[0],
              'commentcount',
              'Books in array should contain commentcount'
            );
            assert.property(
              res.body[0],
              'title',
              'Books in array should contain title'
            );
            assert.property(
              res.body[0],
              '_id',
              'Books in array should contain _id'
            );
            done();
          });
      });
    });

    suite('GET /api/books/[id] => book object with [id]', function () {
      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai
          .request(server)
          .get(`/api/books/5f1ad58a6d37dd349436eae9`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'id Error');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai
          .request(server)
          .get(`/api/books/${testID}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(
              res.body,
              'comments',
              'Books in array should contain commentcount'
            );
            assert.property(
              res.body,
              'title',
              'Books in array should contain title'
            );
            assert.property(
              res.body,
              '_id',
              'Books in array should contain _id'
            );
            done();
          });
      });
    });

    suite(
      'POST /api/books/[id] => add comment/expect book object with id',
      function () {
        test('Test POST /api/books/[id] with comment', function (done) {
          chai
            .request(server)
            .post(`/api/books/${testID}`)
            .send({ comment: "it's work" })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'response should be an object');
              assert.property(
                res.body,
                'comments',
                'Books in array should contain commentcount'
              );
              assert.property(
                res.body,
                'title',
                'Books in array should contain title'
              );
              assert.property(
                res.body,
                '_id',
                'Books in array should contain _id'
              );
              done();
            });
        });
        test('Test POST /api/books/[id] without comment', function (done) {
          chai
            .request(server)
            .post(`/api/books/${testID}`)
            .send({ comment: '' })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'missing comment');
              done();
            });
        });
        test('Test POST /api/books/[id] without body', function (done) {
          chai
            .request(server)
            .post(`/api/books/${testID}`)
            .send({})
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'missing comment');
              done();
            });
        });
        test('Test POST /api/books/[id] with id not in db', function (done) {
          chai
            .request(server)
            .post(`/api/books/5f1ad58a6d37dd349436eae9`)
            .send({ comment: 'test' })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'id Error');
              done();
            });
        });
      }
    );

    suite(
      'DELETE /api/books/[id] => res message delete successful',
      function () {
        test('Test DELETE /api/books/[id] with valid id in db', function (done) {
          chai
            .request(server)
            .delete(`/api/books/${testID}`)
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'delete successful');
              done();
            });
        });

        test('Test DELETE /api/books/[id] with id not in db', function (done) {
          chai
            .request(server)
            .delete(`/api/books/5f1ad58a6d37dd349436eae9`)
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'id Error');
              done();
            });
        });
      }
    );
  });
});
