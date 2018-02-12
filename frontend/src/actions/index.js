import { store } from "../index.js";

export const SET_CATEGORIES = 'SET_CATEGORIES'
export const SELECT_CATEGORY = 'SELECT_CATEGORY'
export const SET_POSTS = 'SET_POSTS'
export const SET_CURRENT_POST = 'SET_CURRENT_POST'
export const SET_COMMENTS = 'SET_COMMENTS'
export const SET_SORT_ORDER = 'SET_SORT_ORDER'
// These apply to either a Post or Comment...
export const EDIT_ITEM = 'EDIT_ITEM'
export const NEW_ITEM = 'NEW_ITEM'
export const DELETE_ITEM = 'DELETE_ITEM'
export const CHANGE_ITEM_SCORE = 'CHANGE_ITEM_SCORE'


export function selectCategory (category) {
  // The category has been selected, we need to update the Posts List accordingly...
  let url = "http://localhost:3001/posts";
  if (category !== "")
    url = "http://localhost:3001/" + category + "/posts";
  
  fetch(url, {headers: {"Authorization": "AFDSAFDSA"}})
    .then(response => response.json())
    .then((json) => store.dispatch(setPostInCategory(json)));
  
  return {
    type: SELECT_CATEGORY,
    category
  }
}

export function setCategories ({ categories }) {
  return {
    type: SET_CATEGORIES,
    categories
  }
}

export function setSortByOrder(sort_order) {
  return {
    type: SET_SORT_ORDER,
    sort_order
  }
}

export function setPostInCategory (posts_in_category) {
  return {
    type: SET_POSTS,
    posts_in_category
  }
}

export function setCurrentPost(current_post) {
  return {
    type: SET_CURRENT_POST,
    current_post
  }
}

export function setComments(comments) {
  return {
    type: SET_COMMENTS,
    comments
  }
}

export function editItem({ id, body, title }) {
  return {
    type: EDIT_ITEM,
    id,
    title,
    body
  }
}

export function addItem(is_comment, post) {
  return {
    type: NEW_ITEM,
    is_comment,
    post
  }
}

export function removeItem(post_id) {
  return {
    type: DELETE_ITEM,
    id: post_id
  }
}

export function changeItemScore(post_id, amount) {
  return {
    type: CHANGE_ITEM_SCORE,
    amount,
    id: post_id
  }
}
