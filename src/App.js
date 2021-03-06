import React, { Component } from "react"
import { ToastContainer } from "react-toastify"
import http from "./services/httpService"
import config from "./config.json"
import "react-toastify/dist/ReactToastify.css"
import "./App.css"

class App extends Component {
  state = {
    posts: []
  }

  async componentDidMount() {
    // pending > resolved (success) or rejected (failed)
    const { data: posts } = await http.get(config.apiEndpoint)
    this.setState({ posts })
  }

  handleAdd = async () => {
    const obj = { title: "a", body: "b" }
    const { data: post } = await http.post(config.apiEndpoint, obj)
    console.log(post)

    const posts = [post, ...this.state.posts] // create new array and add at the beginning
    this.setState({ posts })
  }

  handleUpdate = async post => {
    post.title = "UPDATED"
    const { data } = await http.put(config.apiEndpoint + "/" + post.id, post)

    const posts = [...this.state.posts] // clone all the posts
    const index = posts.indexOf(post) // find index of post in the array
    posts[index] = { ...post } // spread the post
    this.setState({ posts }) // update the new array
  }

  handleDelete = async post => {
    const originalPosts = this.state.posts

    const posts = this.state.posts.filter(p => p.id !== post.id) // we want all the post except the post we're deleting
    this.setState({ posts }) // new post array

    try {
      await http.delete("s" + config.apiEndpoint + "/" + post.id)
      throw new Error("")
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        alert("this post has already been deleted")
      }

      this.setState({ posts: originalPosts })
    }
  }

  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    )
  }
}

export default App
