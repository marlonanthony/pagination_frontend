import React, { Component } from 'react'
import axios from 'axios'
import InfinteScroll from 'react-infinite-scroll-component'
import ApolloClient from 'apollo-boost' 
import { ApolloProvider } from 'react-apollo' 
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import Moment from 'react-moment'
import './App.css'

const client = new ApolloClient({
  uri: '/graphql'
})

const POST_QUERY = gql`
  query PostQuery {
    posts {
      text
      date
      _id
    }
  }
`

class App extends Component {

  state = {
    posts: [],
    count: 10,
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

  // componentDidUpdate(prevState, prevProps) {
  //   if(prevState.posts !== this.state.posts) {
  //     console.log(this.state.posts)
  //   }
  // }

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
      // <ApolloProvider client={client}>
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
              <div style={{ padding: 50, background: 'black', color: 'gray', margin: 10 }} key={post._id}>
                <p>{post.text}</p>
              </div>
            ))}
          </InfinteScroll>
        </div>
      // </ApolloProvider>
    );
  }
}

export default App;



{/* <form onSubmit={this.onSubmit}>
<input type="text" name='text' value={this.state.name} onChange={this.onChange}/>
<input type='submit' />
</form>
<Query query={POST_QUERY}>
{({ loading, error, data }) => {
  if(loading) return <h4>Loading...</h4>
  if(error) console.log(error) 
  console.log(data)
  return ( */}




    // <InfinteScroll
    //   dataLength={data.posts.length}
    //   next={this.fetchMore}
    //   hasMore={true}
    //   loader={<h4>Loading....</h4>}>




//     <div>
//       { data && data.posts.map(post => (
//         <div style={{ padding: 50, background: 'black', color: 'gray', margin: 10 }} key={post._id}>
//           <p><Moment format='MM/DD/YYYY'>{post.date}</Moment></p>
//           <p>{post.text}</p>
//           <p>{post._id}</p>
//         </div>
//       ))}
//     </div>
//     // </InfinteScroll>
//   )
// }}
// </Query>