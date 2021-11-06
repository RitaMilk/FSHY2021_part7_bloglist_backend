const mongoose = require('mongoose')
const listHelper = require('../utils/list_helper')
const logger = require('../utils/logger')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
//part 4 supertest
const Blog = require('../models/blog')
//const bcrypt = require('bcrypt')
//const User = require('../models/user')

/* beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(listHelper.initialBlogs)
}) */
//part 4 supertest
// test('part4_20_0 are returned as json', async () => {
//   await api
//     .get('/api/blogs')
//     .expect(200)
//     .expect('Content-Type', /application\/json/)
// })
//4.20
describe('send two blogs with valid authorization and delete one of them', () => {
  test('just prepare test cases',async() => {
    await Blog.deleteMany({})
    await Blog.insertMany(listHelper.initialBlogs)
  })
  test('add Max Pain', async () => {
    const newUser = {
      username: 'pain',
      name: 'Max Pain',
      password: 'floor',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await listHelper.usersInDb()
    const usernames = usersAtEnd.map(u => u.username)
    console.log('usernames now=',usernames)
    expect(usernames).toContain(newUser.username)
  })
  test('part4_20_1 an authorrized  validblog3 can be added', async () => {
    const newBlog = {
      title: 'Wanted to be deleted',
      author: 'TokenGuru',
      url: 'https://expressjs.com/en/guide/writing-middleware.html',
      likes: 20
    }

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

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization:  token })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    console.log('blahblah')
  })
  test('part4_20_2 an authorrized  valid_blog_3 can be added', async () => {
    const newBlog = {
      title: 'Blog3 Wanted to be deleted',
      author: 'TokenGuru',
      url: 'https://expressjs.com/en/guide/writing-middleware.html',
      likes: 20
    }

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

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization:  token })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    console.log('blahblah')
  })

  test('part4_21 an authorrized blog4 can be deleted', async () => {
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
    console.log('token in delete=',token)
    //const token ='bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9sZCIsImlkIjoiNjBhYjkyMGNkYjhlODYzNjY0NDNkMTQ5IiwiaWF0IjoxNjIxODc1MTM3fQ.dD7YftVqO62WDB1JJxPzwXIO96Xbj-9VcvQs9Fr2ARM'
    const blogsAtStart= await listHelper.blogsInDb()
    const blogToDeleteId=await listHelper.wantedBlog(blogsAtStart)
    console.log(blogToDeleteId.id)
    //logger.info(`deleting blog with id ${blogToDeleteId.id}`)
    await api
      .delete(`/api/blogs/${blogToDeleteId.id}`)
      .set({ Authorization:  token })
      .expect(204)
  })
})
afterAll(() => {
  mongoose.connection.close()
})