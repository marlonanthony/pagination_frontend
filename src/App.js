import React, { Component } from 'react'
import axios from 'axios'
import InfinteScroll from 'react-infinite-scroll-component'
import './App.css'

class App extends Component {

  state = {
    posts: [],
    count: 20,
    start: 0,
    text: ''
  }

  componentDidMount() {
    const { count, start } = this.state 
    axios
    .get(`/posts?limit=${count}&page=${start}`)
    .then(res => this.setState({ posts: res.data }))
    .then(this.setState(prevState => ({ start: prevState.start + 1 })))
    .catch(err => console.log(err)) 
  }

  fetchMore = () => {
    const { count, start, posts } = this.state 
    axios
    .get(`/posts?page=${start}&limit=${count}`)
    .then(res => this.setState({ posts: posts.concat(res.data) }))
    .then(this.setState(prevState => ({ start: prevState.start + 1 })))
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
    console.log(this.state.text)
  }

  onSubmit = e => {
    e.preventDefault()
    const newPost = {
      text: this.state.text 
    }
    axios.post('/posts', newPost)
    .then(res => console.log(res))
    .then(this.setState(prevState => ({ posts: [newPost, ...prevState.posts] })))
    .catch(err => console.log(err))

    e.target.reset() 
  }

  render() {
    const { posts } = this.state 
    return (
      <div className="App">
        <h1>Infinite Scroll</h1>
        <form onSubmit={this.onSubmit}>
          <input type="text" name='text' value={this.state.name} onChange={this.onChange}/>
          <input type='submit' />
        </form>
        <InfinteScroll
          dataLength={posts.length}
          next={this.fetchMore}
          hasMore={true}
          loader={<h4>Loading....</h4>}>
          { posts.map(post => (
            <div key={post._id}>
              <p>{post.text}</p>
            </div>
          ))}
        </InfinteScroll>
      </div>
    );
  }
}

export default App;
