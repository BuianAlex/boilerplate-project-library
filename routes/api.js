/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';
const { clientConnect, clientClose } = require('../db/connect');
var ObjectId = require('mongodb').ObjectId;

//Example connection:

module.exports = function (app) {
  app
    .route('/api/books')
    .get(function (req, res) {
      clientConnect().then((connect) => {
        const db = connect.db('my-database');
        db.collection('books')
          .find({})
          .map((doc) => {
            return {
              _id: doc._id,
              title: doc.title,
              commentcount: doc.comments.length,
            };
          })
          .toArray()
          .then((docs) => {
            clientClose(client);
            res.send(docs);
          });
        //response will be array of book objects
        //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      });
    })
    .post(function (req, res) {
      var title = req.body.title;
      if (typeof title === 'string' && title.length > 0) {
        const prepareDoc = {
          title: title,
          comments: [],
        };
        clientConnect().then((connect) => {
          const db = connect.db('my-database');
          db.collection('books')
            .insertOne(prepareDoc)
            .then((docs) => {
              clientClose(client);
              res.send(docs.ops[0]);
            });
        });
      } else {
        res.send('missing title');
      }
      //response will contain new book object including atleast _id and title
    })

    .delete(function (req, res) {
      clientConnect().then((connect) => {
        const db = connect.db('my-database');
        db.collection('books')
          .deleteMany({})
          .then((docs) => {
            clientClose(client);
            res.send('complete delete successful');
          });
      });
      //if successful response will be 'complete delete successful'
    });

  app
    .route('/api/books/:id')
    .get(function (req, res) {
      const bookId = req.params.id;
      if (ObjectId.isValid(bookId)) {
        clientConnect().then((connect) => {
          const db = connect.db('my-database');
          db.collection('books')
            .findOne({ _id: ObjectId(bookId) })
            // .toArray()
            .then((docs) => {
              clientClose(client);
              if (docs) {
                res.send(docs);
              } else {
                res.send('id Error');
              }
            });
        });
      } else {
        res.send('id Error');
      }

      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      var bookId = req.params.id;
      var comment = req.body.comment;
      if (ObjectId.isValid(bookId)) {
        if (comment && comment.length > 0) {
          clientConnect().then((client) => {
            const db = client.db('my-database');
            db.collection('books')
              .findOneAndUpdate(
                { _id: ObjectId(bookId) },
                {
                  $set: { title: 'false11' },
                  $push: { comments: comment },
                },
                { returnOriginal: false }
              )
              .then((result) => {
                clientClose(client);
                if (!!result.value) {
                  res.send(result.value);
                } else {
                  res.send('id Error');
                }
              });
          });
        } else {
          res.send('missing comment');
        }
      } else {
        res.send('id Error');
      }
      //json res format same as .get
    })

    .delete(function (req, res) {
      const bookId = req.params.id;
      if (ObjectId.isValid(bookId)) {
        clientConnect().then((connect) => {
          const db = connect.db('my-database');
          db.collection('books')
            .deleteOne({ _id: ObjectId(bookId) })
            .then((result) => {
              clientClose(client);
              if (result.deletedCount > 0) {
                res.send('delete successful');
              } else {
                res.send('id Error');
              }
            });
        });
      } else {
        res.send('id Error');
      }

      //if successful response will be 'delete successful'
    });
};
