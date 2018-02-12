//import { combineReducers } from 'redux'

import {
  SELECT_CATEGORY,
  SET_CATEGORIES,
  SET_SORT_ORDER,
  SET_POSTS,
  SET_CURRENT_POST,
  SET_COMMENTS,
  // These apply to either a Post or Comment...
  EDIT_ITEM,
  NEW_ITEM,
  DELETE_ITEM,
  CHANGE_ITEM_SCORE
} from '../actions'

const default_state = {
  // For ListView & CategoriesSidebar
  current_category: "",
  categories: [],
  
  // For ListView
  sort_order: "voteScore",
  posts_in_category: [],
  sort_field: "",
  sort_dir: 1,
  
  // For Post Details view
  current_post: {},
  comments: []
}

function reducer (state = default_state, action) {
  switch (action.type) {
    case SELECT_CATEGORY:
      return {
        ...state,
        current_category: action.category
      }
    case SET_SORT_ORDER:
      if (["voteScore", "title", "timestamp", "commentCount", "category"].includes(action.sort_order))
        return {
          ...state,
          sort_order: action.sort_order
        }
      else
        return state;
    case SET_CATEGORIES:
      return {
        ...state,
        categories: action.categories,
        categories_loaded: true
      }
    case SET_POSTS:
      return {
        ...state,
        posts_in_category: action.posts_in_category,
        posts_loaded: true
      }
    case SET_CURRENT_POST:
      return {
        ...state,
        current_post: action.current_post,
      }
    case SET_COMMENTS:
      return {
        ...state,
        current_category: null,
        comments: action.comments
      }
    case EDIT_ITEM:
    {
      let new_state = { ...state };
      if (new_state.current_post.id === action.id) {
        new_state.current_post.title = action.title;
        new_state.current_post.body = action.body;
      } else { // We're deleting a comment...
        new_state.comments = [];
        for (let comment_item of state.comments) {
          let new_comment = { ...comment_item };
          if (new_comment.id === action.id)
            new_comment.body = action.body;
          new_state.comments.push(new_comment);
        }
      }
      return new_state;
    }
    case NEW_ITEM:
    {
      let new_state = { ...state };
      if (!action.is_comment) {
        new_state.current_post = action.post;
        new_state.comments = [];
      } else if (state.current_post.id === action.post.id) {
        new_state.comments.push(action.post);
      }
      return new_state;
    }
    case DELETE_ITEM:
    {
      let new_state = { ...state };
      if (new_state.current_post.id === action.id) {
        new_state.current_post = {};
        new_state.comments = [];
      } else { // We're deleting a comment...
        new_state.comments = [];
        for (let comment_item of state.comments) {
          let new_comment = { ...comment_item };
          if (new_comment.id === action.id)
            new_comment.deleted =  true;
          new_state.comments.push(new_comment);
        }
      }
      new_state.posts_in_category = state.posts_in_category.filter((post) => post.id !== action.id);
      return new_state;
    }
    case CHANGE_ITEM_SCORE:
    {
      let new_state = { ...state };
      if (new_state.current_post.id === action.id) {
        new_state.current_post = { ...state.current_post };
        new_state.current_post.voteScore += action.amount;
      }
      
      new_state.posts_in_category = [];
      for (let post of state.posts_in_category) {
        let new_post = { ...post };
        if (new_post.id === action.id)
          new_post.voteScore += action.amount;
        new_state.posts_in_category.push(new_post);
      }
      
      new_state.comments = [];
      for (let comment_item of state.comments) {
        let new_comment = { ...comment_item };
        if (new_comment.id === action.id)
          new_comment.voteScore += action.amount;
        new_state.comments.push(new_comment);
      }
      
      return new_state;
    }
    default:
      return state;
  }
}

export default reducer
//combineReducers({ r1, r1 })
