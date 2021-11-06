const mongoose = require('mongoose')
const config1 = require('./utils/config')

/* if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
} */

//const password = process.argv[2]
//const blogTitle=process.argv[3]
//const blogAuthor=process.argv[4]
//console.log('name:',personaName)
//console.log('number:',personaNumber)

//const url =
//  `mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`
//  const url =  `mongodb+srv://fsp3:${password}@cluster0.mkyfv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const url = config1.MONGODB_URI// `mongodb+srv://fsp3:${password}@cluster0.mkyfv.mongodb.net/blog-app?retryWrites=true&w=majority`

//run this file with command node mongo.js
console.log('connetcing to',url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)
//adding hard coded record
const blog=new Blog({
  title: 'second record',
  author: 'Prima Secunda',
  url: 'www.fmi.fi',
  likes: 1
})
//variant 2

blog.save().then(result => {
  console.log(`Added ${result.title}' of ${result.author} to blog list`)
  mongoose.connection.close()
})
//

/* if (blogTitle)
{
  console.log('title: ig given',blogTitle)
}
else
{
  console.log('title is undefined')
}
 */

//variant 1
/* if (!(blogTitle) )
{
  Blog.find({}).then(result => {
    console.log('blog:')
    result.forEach(blog => {
      console.log(blog.title+' '+blog.author)
    })
    mongoose.connection.close()
  })
}
else
{
  //const personaNum = personaNumber ? personaNumber : '0-0'
  const blog = new Blog({
                      title: blogTitle,
                      author: blogAuthor,
                      url: blogUrl,
                      likes: blogLikes
                      })
  blog.save().then(result => {
    console.log(`Added ${blogTitle}' of ${blogAuthor} to blog list`)
    mongoose.connection.close()
  })
} */
