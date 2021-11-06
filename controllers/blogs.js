const config = require('../utils/config')
const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const middleware=require('../utils/middleware')
//app.use(middleware.tokenExtractor)
const Blog = require('../models/blog')
const User = require('../models/user')

//const listHelper = require('../utils/list_helper')

//part 4.18
/* const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
} */
//4.18
blogsRouter.get('/', async (request, response) => {
  /* Blog.find({}).then(blogs => {
    response.json(blogs)
  }) */
  const blogs = await Blog.find({}).
    populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

/* blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
}) */
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }
})
blogsRouter.post('/', middleware.userExtractor,async (request, response) => {
  //console.log('1.entered blogsPost')
  const body = request.body
  //console.log('2.request.body.likes=',request.body.likes)
  //console.log('3.request.token=',request.token)
  //part 4.20
  //part4.20 is moved into middleware due to part4.22
  /* const decodedToken = jwt.verify(request.token, config.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  console.log('4. blogsPost user decodedToken.id=',decodedToken.id)
  const user = await User.findById(decodedToken.id) part4.20 moved*/
  const user=request.user
  //
  //--console.log('users =', user)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })
  /*const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })*/
  //console.log('5.saving user\'s list of blogs')
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.json(savedBlog.toJSON())
})
//****************
//**   DELETE    *
//****************
blogsRouter.delete('/:id',middleware.userExtractor, async (request, response) => {
  //console.log('1. in delete controller')
  //console.log('2. inserted request.token=',request.tokrn)

  /* part4.22 refactoring const decodedToken = jwt.verify(request.token, config.SECRET)
  console.log('2. in delete controller, decod is done')
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  console.log('3. token was ok')
  const userid=decodedToken.id
  const userFromRequest = await User.findById(userid)
  console.log('4. user is found by decodedToken.id=',userid) */
  const userFromRequest =request.user
  //console.log('3.inserted user=',userFromRequest)
  //console.log('5. look for log with id',request.params.id)
  //const BlogToDelete = await Blog.find(request.params.id)
  const BlogToDelete = await Blog.findById(request.params.id)
  /* console.log('6.blogtodelete',BlogToDelete)
  console.log('7.BlogToDelete.user.toString=',BlogToDelete.user.toString())
  console.log('8.userFromRequest.toString()',userFromRequest.toString())
  console.log('9.userid_d fo comparision=',userFromRequest._id)
  console.log('9a.userid id fo comparision=',userFromRequest.id) */
  if ( BlogToDelete.user.toString() === userFromRequest.id.toString() ) {
    await Blog.findByIdAndRemove(request.params.id)
    const userBlogsID=userFromRequest.blogs
    //console.log('users list of blogs at start=',userBlogsID)

    //console.log('blogs length=',leftBlogsID.length)
    const stringToExclude=request.params.id.toString()
    //console.log('string to remove from list=',stringToExclude)
    const leftBlogsID=userBlogsID.filter(item => {
      //console.log('item.toString=',item.toString())
      return (item.toString()!==stringToExclude)
    })
    //console.log('maped blogs are=',leftBlogsID)
    //console.log('blogs length=',leftBlogsID.length)
    if (leftBlogsID.length===0){
      userFromRequest.blogs =[]
    }
    else {
      userFromRequest.blogs = leftBlogsID
    }
    await userFromRequest.save()

    response.status(204).end()
  }
  else{
    return response.status(401).json({ error: 'token missing or invalid' })
  }

})


blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {}
  if (body.title) {
    blog.title = body.title
  }
  if (body.author) {
    blog.author = body.author
  }
  if (body.url) {
    blog.url = body.url
  }
  if (body.likes) {
    blog.likes = body.likes
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog.toJSON)
  /* Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error)) */
})

module.exports = blogsRouter