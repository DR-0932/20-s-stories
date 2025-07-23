const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

/**
 * GET /
 * HOME
*/
router.get('', async (req, res) => {
  try {
    const locals = {
      title: "20's Diaries ",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let perPage = 5;
    let page = req.query.page || 1;

    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    // Count is deprecated - please use countDocuments
    // const count = await Post.count();
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', { 
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});
/**
 * GET /
 * POST ID
*/
router.get('/post/:id', async (req, res) => {
  try{
    let slug= req.params.id;
    
    const data = await Post.findById( {_id: slug} );

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    }
    res.render('post', {
      locals,
      data,
      currentRoute: `/post/${slug}`
    });
  } catch(error){
    console.log(error);
  }
});

/**
 * POST /
 * POST ID
*/

router.post('/search', async (req, res) => {
 
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-z0-9]/g,"")

    const data =await Post.find({
      $or:[
        { title: { $regex: new RegExp(searchNoSpecialChar,'i')}},
        { body: { $regex: new RegExp(searchNoSpecialChar,'i')}}

      ]
    });
  
    // const data = await Post.find();
    res.render('search', {locals, data});
  } catch (error) {
    console.log(error);
  }

});





/*

function insertPostData () {
  Post.insertMany([
    {
      title: "Building a Blog",
      body: "This is the body text",

    },
    {
      title: "Building",
      body: "This is the body text",

    },
    {
      title: "Sample text requirem etc",
      body: "This is the body text",

    },
    {
      title: "Ver em therim eqs the ques entra",
      body: "This is the body text",

    },
  ])
}
insertPostData();
*/


 





/**Routes
 * GET/
 * ABOUT PAGE
 * **/ 


router.get('/about', (req,res)=>{
  res.render('about',{currentRoute:'/about'});
})
router.get('/contact', (req,res)=>{
  res.render('contact',{currentRoute:'/contact'});
})

module.exports = router;