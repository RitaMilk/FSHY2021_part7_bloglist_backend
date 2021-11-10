//const config = require('../utils/config')
//const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const middleware=require('../utils/middleware')
//app.use(middleware.tokenExtractor)
const Blog = require('../models/blog')
//const User = require('../models/user')
const Comment=require('../models/comment')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).
    populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).
    populate('user',{ username: 1, name: 1 }).
    populate('comment',{ comment:1  })
  if (blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', middleware.userExtractor,async (request, response) => {
  //console.log('1.entered blogsPost')
  const body = request.body
  const user=request.user
  //
  //console.log('users =', user)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })
  //console.log('5.saving user\'s list of blogs')
  //part 7.14 related to frintend if own blog
  blog.user = user
  //part 7.14 related to frintend if own blog
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.json(savedBlog.toJSON())
})
//****************
//**   DELETE    *
//****************
blogsRouter.delete('/:id',middleware.userExtractor, async (request, response) => {
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

})

blogsRouter.post('/:id/comments', async (request, response) => {
  //console.log('1.entered blogsPost')
  const body = request.body
  //const blogFromRequest=request.params.id
  //console.log('2.request.body =', request.body)
  //console.log('3.id=',request.params.id)
  const comment = new Comment({
    comment: body.comment,
    blog: request.params.id
  })
  //console.log('4.saving comment')
  //part 7.14 related to frontend if own blog
  const blogByIdRequest = await Blog.findById(request.params.id)
  //console.log('Blog =',blogByIdRequest)
  comment.blog=request.params.id
  const savedComment=await comment.save()
  //console.log('savedComment=',savedComment)
  blogByIdRequest.comment = blogByIdRequest.comment.concat(savedComment._id)
  await blogByIdRequest.save()
  //console.log('blogByIdRequest=',blogByIdRequest)
  response.json(savedComment.toJSON())
})

module.exports = blogsRouter