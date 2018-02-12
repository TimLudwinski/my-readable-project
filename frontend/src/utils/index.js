const AUTH_TOKEN = 'AFDSAFDSA'; //TODO: generate this based on user

export function getCategories(setCategories) {
      fetch("http://localhost:3001/categories", {headers: {"Authorization": AUTH_TOKEN}})
            .then(response => response.json())
            .then((json) => setCategories(json));
}

export function getPostData(post_id, setCurrentPost, setComments) {
  fetch("http://localhost:3001/posts/" + post_id + "/comments", {headers: {"Authorization": AUTH_TOKEN}}).then(response => response.json())
          .then((json) => setComments(json));
  return fetch("http://localhost:3001/posts/" + post_id, {headers: {"Authorization": AUTH_TOKEN}}).then(response => response.json())
          .then((json) => setCurrentPost(json));
}

export function editItemData(is_comment, { id, title, body, parentId }, editItem) {
  let edit_details = { body };
  if (!is_comment) {
    edit_details.title = title;
  } else {
    edit_details.parentId = parentId;
  }
  return fetch("http://localhost:3001/" + (is_comment ? "comments" : "posts") + "/" + id, {method: 'PUT', body: JSON.stringify(edit_details), headers: {'Content-Type': 'application/json', "Authorization": AUTH_TOKEN}})
          .then(() => editItem({id, title, body}));
}

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (((c ^ crypto.getRandomValues(new Uint8Array(1))[0]) & 15) >> c / 4).toString(16)
  )
}

export function newItem(is_comment, { title, body, parentId, category }, addItem) {
  let new_post_data = { body, id: uuidv4(), author: AUTH_TOKEN, timestamp: Date.now()};
  if (!is_comment) {
    new_post_data.title = title;
    new_post_data.category = category; 
  } else
    new_post_data.parentId = parentId;
  return fetch("http://localhost:3001/" + (is_comment ? "comments" : "posts"), {method: 'POST', body: JSON.stringify(new_post_data), headers: {'Content-Type': 'application/json', "Authorization": AUTH_TOKEN}})
          .then(() => addItem(is_comment, new_post_data));
}

export function deletePost(post_id, is_comment, removePost) {
  let item_type = is_comment ? "comments" : "posts";
  return fetch("http://localhost:3001/" + item_type + "/" + post_id, {method: 'DELETE', headers: {'Content-Type': 'application/json', "Authorization": AUTH_TOKEN}})
          .then(() => removePost(post_id));
}

export function upVotePost(post_id, is_comment, changeItemScore) {
  let item_type = is_comment ? "comments" : "posts";
  return fetch("http://localhost:3001/" + item_type + "/" + post_id, {method: 'POST', body: JSON.stringify({option: "upVote"}), headers: {'Content-Type': 'application/json', "Authorization": AUTH_TOKEN}})
          .then(() => changeItemScore(post_id, 1));
}

export function downVotePost(post_id, is_comment, changeItemScore) {
  let item_type = is_comment ? "comments" : "posts";
  return fetch("http://localhost:3001/" + item_type + "/" + post_id, {method: 'POST', body: JSON.stringify({option: "downVote"}), headers: {'Content-Type': 'application/json', "Authorization": AUTH_TOKEN}})
          .then(() => changeItemScore(post_id, -1));
}