import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { setSortByOrder, removeItem, changeItemScore } from '../actions';
import { deletePost, upVotePost, downVotePost } from '../utils';

class ListView extends Component {
  isSortBy(field) {
    if (field === this.props.sort_order)
      return "↓ ";
    else
      return "";
  }
  
  onEditClick(e) {
    this.props.history.push("/edit/" + e.target.parentElement.id);
    e.preventDefault();
  }
  
  onSortClick(e, sort_order) {
    this.props.setSortByOrder(sort_order);
    e.preventDefault();
  }
  
  onDeleteClick(e) {
    if (window.confirm("Are you sure you want to delete this post?"))
      deletePost(e.target.parentElement.id, false, this.props.removeItem);
    e.preventDefault();
  }
  
  onUpVoteClick(e) {
    upVotePost(e.target.parentElement.id, false, this.props.changeItemScore);
  }
  
  onDownVoteClick(e) {
    downVotePost(e.target.parentElement.id, false, this.props.changeItemScore);
  }
  
  render() {
    return (
      <div className="List-View-Container">
        <div className="Post-Header">
          <a href="" onClick={(e) => this.onSortClick(e, "voteScore")}>{this.isSortBy("voteScore")}Sort by Score</a> -&nbsp;
          <a href="" onClick={(e) => this.onSortClick(e, "title")}>{this.isSortBy("title")}Sort by Title</a> -&nbsp;
          <a href="" onClick={(e) => this.onSortClick(e, "timestamp")}>{this.isSortBy("timestamp")}Sort by Date</a> -&nbsp;
          <a href="" onClick={(e) => this.onSortClick(e, "commentCount")}>{this.isSortBy("commentCount")}Sort by #Comments</a>
          { (this.props.current_category !== "") ? (<span></span>) : (<span>-&nbsp; <a href="" onClick={(e) => this.onSortClick(e, "category")}>{this.isSortBy("category")}Sort by Category</a></span>) }
        </div>
        {this.props.posts.filter((post) => post.deleted !== true).sort((a, b) => a[this.props.sort_order] < b[this.props.sort_order]).map( (post) =>
          (<div className="Post-Row" key={post.id} id={post.id}>
            <span onClick={(e) => this.onUpVoteClick(e) } className="fa fa-arrow-circle-o-up Post-Spinner"></span>
            <span onClick={(e) => this.onDownVoteClick(e) } className="fa fa-arrow-circle-o-down Post-Spinner"></span> &nbsp;
            <span className={post.voteScore < 0 ? 'Post-Score Red' : 'Post-Score'}>{post.voteScore}</span> -&nbsp;
            <Link className="Post-Title" to={"/" + post.category + "/" + post.id}>{post.title}</Link> -&nbsp;
            <span className="Post-Author">by {post.author}</span> -&nbsp;
            <span className="Post-Date">{new Date(post.timestamp).toLocaleString()}</span> -&nbsp;
            <span className="Post-Comments">{post.commentCount} comments</span> -&nbsp;
            <span className="Post-Category">{post.category}</span> -&nbsp;
            <a href="/" className="Post-Delete" onClick={(e) => this.onDeleteClick(e)} >Delete</a> -&nbsp;
            <a href="" className="Post-Edit" onClick={(e) => this.onEditClick(e)}>Edit</a>
          </div>)
        )}
        <Link to="/new"><button className="Post-New">New Post</button></Link>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  current_category: state.current_category,
  sort_order: state.sort_order,
  posts_loaded: state.posts_loaded,
  posts: state.posts_in_category
});
const mapDispatchToProps = (dispatch) => ({
  setSortByOrder: (data) => dispatch(setSortByOrder(data)),
  removeItem: (data) => dispatch(removeItem(data)),
  changeItemScore: (post_id, amount) => dispatch(changeItemScore(post_id, amount))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListView));
