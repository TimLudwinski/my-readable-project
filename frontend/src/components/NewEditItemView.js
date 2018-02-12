import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { selectCategory } from '../actions';
import { setCurrentPost, setComments, editItem, addItem } from '../actions';
import { getPostData, editItemData, newItem } from '../utils';

class NewEditItemView extends Component {
  state = {
    body: "",
    title: "",
    selected_category: this.props.current_category || this.props.categories[0],
    is_comment: false,
    mode: "new"
  }
  
  componentDidMount() {
    let path_split = this.props.location.pathname.split("/");
    
    let mode = path_split[1]; // new or edit
    let main_post_id = path_split[2];
    let is_comment = path_split.length === 5 || path_split.length === 4;
    let parent_id, editing_id;
    let body = "";
    let title = "";
    if (is_comment) {
      parent_id = main_post_id;
      editing_id = path_split[4];
    } else {
      editing_id = main_post_id;
      parent_id = null;
    }
    
    let set_state_promise = new Promise((resolve, reject) => resolve());
    if (mode === "edit") {
      if (main_post_id !== this.props.current_post.id)
        set_state_promise = getPostData(main_post_id, this.props.setCurrentPost, this.props.setComments);
      if (is_comment) {
        set_state_promise.then(() => {
          let comment_item = this.props.comments.filter((comment) => comment.id === editing_id)[0]; // There should be only one...
          body = comment_item.body;
        });
      } else {
        set_state_promise.then(() => { body = this.props.current_post.body; title = this.props.current_post.title; });
      }
    }
    set_state_promise.then(() => this.setState({body, title, mode, is_comment, main_post_id, parent_id, editing_id, "selected_category": this.props.current_post.category || this.props.categories[0]}));
  }
  
  onFormSubmit(e) {
    if (this.state.mode === "edit") {
      editItemData(this.state.is_comment, {id: this.state.editing_id, title: this.state.title, body: this.state.body}, editItem)
        .then(() => this.props.history.push("/" + this.props.current_post.category + "/" + this.state.main_post_id));
    } else {
      newItem(this.state.is_comment, {title: this.state.title, body: this.state.body, category: this.state.selected_category, parentId: this.state.parent_id}, addItem)
        .then( (new_post) => this.props.history.push("/" + this.state.selected_category + "/" + (this.state.main_post_id||new_post.post.id)) );
    }
    
    e.preventDefault();
  }
  
  onTitleChange(e) {
    this.setState({"title": e.target.value});
  }
  
  onBodyChange(e) {
    this.setState({"body": e.target.value});
  }
  
  onCategoryChange(e) {
    this.setState({"selected_category": e.target.value});
  }
  
  render() {
    return (
      <div>
        <h1>{this.state.mode === "edit" ? "Edit": "New"} { this.state.is_comment ? "Comment" : "Post" }</h1>
        <form>
        { (! this.state.is_comment ) ? (
          <div>
            <h1><input type="text" className="Edit-Title" value={this.state.title} onChange={(e) => this.onTitleChange(e)}/></h1>
          </div>
        ) : "" }
          
          <div>
            <textarea value={this.state.body} onChange={(e) => this.onBodyChange(e)}/>
          </div>
          
          { this.state.mode === "new" && ! this.state.is_comment ? (
          <div>
            Category: &nbsp;
            <select value={this.state.selected_category}  onChange={(e) => this.onCategoryChange(e)}>
              { this.props.categories.map((category) => (<option key={category.path} value={category.path}>{category.name}</option>)) }
            </select>
          </div>) : ""}
          
          <div>
            <button onClick={(e) => this.props.history.goBack()}>Cancel</button>
            <input type="submit" value="Post" onClick={(e) => this.onFormSubmit(e)}/>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  current_category: state.current_category,
  categories: state.categories,
  current_post: state.current_post,
  comments: state.comments
});

const mapDispatchToProps = (dispatch) => ({
  selectCategory: (data) => dispatch(selectCategory(data)),
  setCurrentPost: (data) => dispatch(setCurrentPost(data)),
  setComments: (data) => dispatch(setComments(data)),
  
  editItem: (title, body) => dispatch(editItem(title, body)),
  addItem: (data) => dispatch(addItem(data))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewEditItemView))
