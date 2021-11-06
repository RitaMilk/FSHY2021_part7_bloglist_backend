const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})
describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const testData1=require('../utils/testingData')
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })
  test('when list has many blog, equals the likes of all that', () => {
    const result = listHelper.totalLikes(testData1.blogs)
    expect(result).toBe(36)
  })
})
//4.5 favoriteBlog test
describe('favorite blog', () => {
  const expectedBlog={
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    likes: 12
  }
  const testData1=require('../utils/testingData')
  test('blog with most likes', () => {
    const result = listHelper.favoriteBlog(testData1.blogs)
    expect(result).toEqual(expectedBlog)
  })
})
