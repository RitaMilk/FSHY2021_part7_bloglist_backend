const mongoose = require('mongoose')
const listHelper = require('../utils/list_helper')
const logger = require('../utils/logger')
const supertest = require('supertest')
const app = require('../app')


const api = supertest(app)
//part 4 supertest
const Blog = require('../models/blog')
//part 4.15
const bcrypt = require('bcrypt')
const User = require('../models/user')
//4.15
//const { response } = require('express')

beforeEach(async () => {
  await Blog.deleteMany({})
  /* let blogObject = new Blog(listHelper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(listHelper.initialBlogs[1])
  await blogObject.save() */
  await Blog.insertMany(listHelper.initialBlogs)
})
//part 4 supertest
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')
  // execution gets here only after the HTTP request is complete
  // the result of HTTP request is saved in variable response
  expect(response.body).toHaveLength(2)
})
test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(listHelper.initialBlogs.length)
})
test('the first blog is about HTTP methods', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].title).toEqual('React patterns')
})
test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.title)
  expect(contents).toContain(
    'Go To Statement Considered Harmful')
})
test('the first blog has id property', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].id).toBeDefined()
})
//part 4.10
test('part_4_10 a validblog can be added', async () => {
  const newBlog = {
    title: 'I_am_blog of part_4_10',
    author: 'Old Lady',
    url: 'https://fullstackopen.com/en/part4/testing_the_backend#more-tests-and-refactoring-the-backend',
    likes: 1
  }
  //4.23 add user
  const user ={
    username: 'old',
    password: 'divan'
  }

  const resultUser=await api
    .post('/api/login')
    .send(user)
    .expect(200)

  let token ='bearer '
  token=await token.concat(resultUser.body.token.toString())
  console.log('token in post=',token)
  //4.23

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set({ Authorization:  token })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  //
  const blogsAtEnd = await listHelper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(listHelper.initialBlogs.length + 1)

  // const contents = notesAtEnd.map(n => n.content)
  const titles = blogsAtEnd.map(r => r.title)
  //
  // response = await api.get('/api/blogs')

  //const titles = response.body.map(r => r.title)

  //expect(response.body).toHaveLength(initialBlogs.length + 1)

  expect(titles).toContain(
    'I_am_blog of part_4_10'
  )
})
//4.10
//
//part 4.11
test('part_4_11 blogs likes is set to 0 by default', async () => {
  console.log('1.part_4_11 blogs likes is set to 0 by default')
  const newBlog = {
    title: 'I am blog of part_4_11 if property is missing',
    author: 'Old Lady',
    url: 'www.fmi.fi'
  }
  //4.23 add user
  const user =
  {
    username: 'old',
    password: 'divan'
  }
  console.log('2.want to log in part_4_11')
  const resultUser=await api
    .post('/api/login')
    .send(user)
    .expect(200)

  let token ='bearer '
  token=await token.concat(resultUser.body.token.toString())
  console.log('token in part_4_11_post=',token)
  //4.23


  await api
    .post('/api/blogs')
    .send(newBlog)
    .set({ Authorization : token })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  //const titles = response.body.map(r => r.title)
  let isByCriteria = function (record) {
    return record.title === 'I am blog of part_4_11 if property is missing'
  }
  const titlesAndLikes = await response.body.filter(isByCriteria)[0]
  //const titlesAndLikes = response.body.map(r => {return { title:r.title,likes:r.likes }}).filter( r => r.titles==='if property is missing')

  expect(response.body).toHaveLength(listHelper.initialBlogs.length + 1)
  console.log('titlesAndLikes', titlesAndLikes)
  //logger.info('titlesAndLikes', titlesAndLikes)
  expect(titlesAndLikes.title).toContain(
    'I am blog of part_4_11 if property is missing'
  )
  expect(titlesAndLikes.likes).toBe(0)

})
//4.11
//part 4.12
test('catch status 400 if title is missing', async () => {

  const newBlog = {
    author: 'JSGuru',
    url: 'https://mongoosejs.com/docs/guide.html#definition',
    likes: 1
  }
  //4.23 add user
  const user ={
    username: 'old',
    password: 'divan'
  }

  const resultUser=await api
    .post('/api/login')
    .send(user)
    .expect(200)

  let token ='bearer '
  token=await token.concat(resultUser.body.token.toString())
  console.log('token in post=',token)
  //4.23
  // eslint-disable-next-line indent
  await api
    .post('/api/blogs')
    .send(newBlog)
    .set({ Authorization:token })
    .expect(400)
    .expect('Content-Type', /application\/json/)

  //const response = await api.get('/api/blogs')
  const blogsAtEnd = await listHelper.blogsInDb()
  //expect(response.body).toHaveLength(helper.initialBlogs.length)
  expect(blogsAtEnd).toHaveLength(listHelper.initialBlogs.length)

})
test('catch status 400 if url is missing', async () => {

  const newBlog = {
    title: 'catch status 400 if url is missing',
    author: 'JSGuru',
    likes: 1
  }
  //4.23 add user
  const user ={
    username: 'old',
    password: 'divan'
  }

  const resultUser=await api
    .post('/api/login')
    .send(user)
    .expect(200)

  let token ='bearer '
  token=await token.concat(resultUser.body.token.toString())
  console.log('token in post=',token)
  //4.23
  // eslint-disable-next-line indent
  await api
    .post('/api/blogs')
    .send(newBlog)
    .set({ Authorization:token })
    .expect(400)
    .expect('Content-Type', /application\/json/)
  //const response = await api.get('/api/blogs')
  //expect(response.body).toHaveLength(initialBlogs.length)
  const blogsAtEnd = await listHelper.blogsInDb()
  //expect(response.body).toHaveLength(helper.initialBlogs.length)
  expect(blogsAtEnd).toHaveLength(listHelper.initialBlogs.length)

})
//4.12
/* //part 4.13
describe('deletion of a blog', () => {
  test('part_4_13 blog delete succeeds with status code 204 if id is valid', async () => {
    const usersAtStart = await listHelper.usersInDb()
    console.log('--------------1. usersAtStart',usersAtStart)
    const userWantToDelBlog=await listHelper.wantedUser(usersAtStart)
    console.log('2. usersAtStart',userWantToDelBlog)
    //4.23 add user
    const user ={
      username: 'old',
      password: 'divan'
    }

    const loggingUser=await api
      .post('/api/login')
      .send(user)
      .expect(200)

    let token ='bearer '
    token=await token.concat(loggingUser.body.token.toString())
    //console.log('2.token in post=',token)

    //console.log('2a.logginUser.body=',loggingUser.body)

    //const fetchedUser=await api
    //  .get(`/api/users/${loggingUser.id}`)

    //console.log('3.fetched user=',fetchedUser.body)

    const blogsAtStart1 =await userWantToDelBlog.blogs
    console.log('4_13: 3.blogsAtStart=',blogsAtStart1)
    console.log('4_13: 4.blogToDelete.id=',blogsAtStart1[0])
    const blogToDeleteId = await blogsAtStart1[0].toString()
    console.log('4_13: 5.blogToDeleteId=',blogToDeleteId)
    const blogToDelete1 =  await Blog.findById(blogToDeleteId)
    //4.23


    await api
      .delete(`/api/blogs/${blogToDeleteId}`)
      .set({ Authorization:token })
      .expect(204)

    const blogsAtEnd = await listHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(
      listHelper.initialBlogs.length - 1
    )
    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete1.title)
  })
})
//4.13
 *///part 4.14
describe('update a blog', () => {
  test('blog can be updated', async () => {
    const blogsAtStart = await listHelper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    console.log('blog to update', blogToUpdate.id)
    const upBlog = {}
    upBlog.title = blogToUpdate.title + '_1'
    upBlog.author = blogToUpdate.author + '_1'
    upBlog.likes = blogToUpdate.likes + 7

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(upBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    //
    const blogsAtEnd = await listHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(listHelper.initialBlogs.length)
    const response = await api
      .get(`/api/blogs/${blogToUpdate.id}`)
    const updatedBlog = response.body
    expect(updatedBlog.title).toContain(upBlog.title)
  })
})
//4.14
//part 4.15
describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
  //})
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  //part 4.16
  test('username less than 3 marks return status code 400', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'ml',
      name: 'Matti Latti',
      password: 'sal',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    //.expect(response.body,/`password have to be 3 or more marks`)
    //.expect('Content-Type', /application\/json/)

    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  test('password less than 3 marks return status code 400', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'abc',
      name: 'Matti Latti',
      password: '12',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    //.expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password have to be 3 or more marks')
    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  test('missing of password returns status code 400', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'abc',
      name: 'Matti Latti'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    //.expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password missing')
    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  test('missing of username returns status code 400', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      name: 'Matti Latti',
      password: 'verygood'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    //.expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('User validation failed: username: Path `username` is required.')
    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  //4.16
})
describe('when there are initially two(three) user at db', () => {
  beforeEach(async () => {
    const twoUsers = listHelper.twoUsers
    await User.deleteMany({})
    await User.insertMany(twoUsers)

    await Blog.deleteMany({})
    await Blog.insertMany(listHelper.initialBlogs)
  })
  test('a validblog2 can be added', async () => {
    console.log('entered test a validblog2 can be added')
    const newBlog = {
      title: 'async/await simplifies making async calls in validblog2',
      author: 'JSGuru',
      url: 'https://fullstackopen.com/en/part4/testing_the_backend#more-tests-and-refactoring-the-backend',
      likes: 1
    }
    //4.23 add user
    const user ={
      username: 'old',
      password: 'divan'
    }

    const resultUser=await api
      .post('/api/login')
      .send(user)
      .expect(200)

    let token ='bearer '
    token=await token.concat(resultUser.body.token.toString())
    console.log('token in post=',token)
    //4.23

    console.log('post blogs')
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization:token })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    //
    const blogsAtEnd = await listHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(listHelper.initialBlogs.length + 1)

    // const contents = notesAtEnd.map(n => n.content)
    const titles = blogsAtEnd.map(r => r.title)
    //
    console.log('titles=',titles)

    expect(titles).toContain(
      'async/await simplifies making async calls in validblog2'
    )
  })
  //4.16
})
afterAll(() => {
  mongoose.connection.close()
})