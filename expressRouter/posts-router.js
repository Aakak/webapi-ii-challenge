const router = require('express').Router();

const Posts = require('../data/db.js');

// | GET    | /api/posts              | Returns an array of all the post objects contained in the database.  
router.get('/', (req, res) => {
    const query = req.query;
    Posts
    .find()
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: "Error retrieving the posts"
        });
    });
});


// | GET    | /api/posts/:id          | Returns the post object with the specified id.  
router.get('/:id', (req, res) => {
    console.log(req.params.id);
    let id = req.params.id;
    Posts.findById(id)
            .then(post => {
                res.status(200).json(post)
            })
            .catch(err =>{
                res.status(500).json({err : "Id is not found"})
            })
});



// | POST   | /api/posts/:id/comments | Creates a comment for the post with the specified id using information sent inside of the `request body`. 
router.post('/:id/comments', (req, res) => {
    const comment = req.body;
    const { id } = req.params;
    if(!id){
        res.status(404).json({ message: "this post comment could not be found" })
    }
    else if(!comment.text){
        res.status(400).json({ errorMessage: "text required" })
    }
    else if(id && comment.text) {
      comment.post_id = id
      Posts.insertComment(comment)
            .then(result => {
                Posts.findCommentById(result.id)
                .then(comment => {
                    res.status(200).json(comment)
                })
                .catch(err =>{
                    res.status(500).json({err : "Comments are not found"})
                })
            })
            .catch(err => {
                console.log(err);

                res.status(500).json({err : "Issues with insert post"})
            })
    }
    }
)


// | GET    | /api/posts/:id/comments | Returns an array of all the comment objects associated with the post with the specified id. 
router.get('/:id/comments', (req, res) => {
    Posts.findPostComments(req.params.id)
          .then(comments => {
              res.status(200).json(comments)
          })
          .catch(err =>{
              res.status(500).json({err : "Comments are not found"})
          })
  });

  
  // | POST   | /api/posts              | Creates a post using the information sent inside the `request body`
  router.post(`/`, (req, res) => {
    const title = req.body.title; 
    const contents = req.body.contents; 

    if(!title || !contents){
        res.status(400).json({ errorMessage: "Need title and content" })
    }
    else{
      Posts.insert(req.body)
            .then(post => {
                res.status(201).json({post})
            })
            .catch(err => {
                res.status(500).json({err : "Issues with insert post"})
            })
    }
})


//   | DELETE | /api/posts/:id          | Removes the post with the specified id and returns the **deleted post object**. You may need to make additional calls to the database in order to satisfy this requirement. |
  router.delete('/:id', (req, res) => {
      const id = req.params.id;
      if(!id){
          res.status(404).json({ message: "Id is not found"})
      }
      else{
        Posts.findById(id)
        .then(post => {
            Posts.remove(id)
              .then(deleted => {
                  if(deleted){
                      res.status(200).json(post)
                  }
              })
              .catch(err => {
                  res.setEncoding(500).json({
                      error: "issues with remove post"
                  })
              })
        })
        .catch(err =>{
            res.status(500).json({err : "Post is not found"})
        })
      }
  })
  
//   | PUT    | /api/posts/:id          | Updates the post with the specified `id` using data from the `request body`. Returns the modified document, **NOT the original**.  
  router.put("/:id", (req, res) => {
      const id = req.params.id;
      const update = req.body;
  
      if (!update.title && !update.contents)
        res.status(400).json({
          errorMessage: "Need title and content"
        });
      else {
        Posts.update(id, update)
          .then(updated => {
            if (updated) {
                Posts.findById(id)
                .then(post => {
                  res.status(200).json({ api: "update", post });
                })
                .catch(error => {
                  res.send(500).json({
                    error: "can't update data"
                  });
                });
            } else {
              res.status(404).json({
                message: "Id is not found"
              });
            }
          })
          .catch(error => {
            res.send(500).json({
              error: "can't update data"
            });
          });
      }
    });
  
  module.exports = router;





