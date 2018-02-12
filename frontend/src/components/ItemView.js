import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { setCurrentPost, setComments, removeItem, changeItemScore } from '../actions';
import { getPostData, deletePost, upVotePost, downVotePost } from '../utils';

class ItemView extends Component  {
  componentDidMount() {
    if (this.props.location) {
      const path_split = this.props.location.pathname.split("/");
      getPostData(path_split[2], this.props.setCurrentPost, this.props.setComments);
    }
  }
  
  onEditClick(e) {
    if (!this.props.is_comment)
      this.props.history.push("/edit/" + this.props.current_post.id);
    else
      this.props.history.push("/edit/" + this.props.parent.id + "/comment/" + this.props.current_post.id);
    e.preventDefault();
  }
  
  onDeleteClick(e) {
    if (window.confirm("Are you sure you want to delete this " + (this.props.is_comment ? "comment" : "post") + "?")) {
      deletePost(this.props.current_post.id, this.props.is_comment, this.props.removeItem);
      
      if (!this.props.is_comment)
        this.props.history.push("/");
    }
    e.preventDefault();
  }
  
  onUpVoteClick(e) {
    upVotePost(this.props.current_post.id, this.props.is_comment, this.props.changeItemScore);
  }
  
  onDownVoteClick(e) {
    downVotePost(this.props.current_post.id, this.props.is_comment, this.props.changeItemScore);
  }
  
  onNewComment(e) {
    this.props.history.push("/new/" + this.props.current_post.id + "/comment");
    e.preventDefault();
  }
  
  render() {
    return (
      <div className="Post-Details-Content">
        <div className="Post-Details-Sidebar">
          <div>
            <span onClick={(e) => this.onUpVoteClick(e) } className="fa fa-arrow-circle-o-up Post-Spinner"></span>
            <span onClick={(e) => this.onDownVoteClick(e) } className="fa fa-arrow-circle-o-down Post-Spinner"></span> &nbsp;
            <span className={this.props.current_post.voteScore < 0 ? 'Post-Score Red' : 'Post-Score'}>{this.props.current_post.voteScore}</span>
          </div>
          <div>
            <span className="Post-Author">by {this.props.current_post.author}</span> on <small>{new Date(this.props.current_post.timestamp).toLocaleString()}</small>
          </div>
          <div>
            <button onClick={(e) => this.onEditClick(e)}>Edit</button> - <button onClick={(e) => this.onDeleteClick(e)}>Delete</button>
          </div>
        </div>

        <h3>{this.props.current_post.title}</h3>
        <pre>{this.props.current_post.body}</pre>

        {this.props.comments && this.props.comments.filter((child) => !child.deleted).map((child) => (
          <ItemView current_post={child} key={child.id} is_comment={true} history={this.props.history} parent={this.props.current_post} changeItemScore={this.props.changeItemScore} removeItem={this.props.removeItem}/>
        ))}
        
        { (!this.props.is_comment) ? (<div><button onClick={(e) => this.onNewComment(e)}>Comment</button></div>) : "" }
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  categories: state.categories,
  current_post: state.current_post,
  comments: state.comments,
  is_comment: false
});
const mapDispatchToProps = (dispatch) => ({
  setCurrentPost: (data) => dispatch(setCurrentPost(data)),
  setComments: (data) => dispatch(setComments(data)),
  removeItem: (data) => dispatch(removeItem(data)),
  changeItemScore: (post_id, amount) => dispatch(changeItemScore(post_id, amount))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ItemView));
