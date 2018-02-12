import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import CategoriesSidebar from './CategoriesSidebar.js';
import ListView from './ListView.js';
import ItemView from './ItemView.js';
import NewEditItemView from './NewEditItemView.js';
import { setCategories, selectCategory } from '../actions';
import { getCategories } from '../utils';

class App extends Component {
  componentDidMount() {
    if (!this.props.categories_loaded)
      getCategories(this.props.setCategories);
    this.props.selectCategory("");
  }
  
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title"><img src={logo} className="App-logo" alt="logo" /> My Readable Project</h1>
          </header>

          <CategoriesSidebar />

          <div className="Main-Content">
            <Route exact path="/" component={ListView} />
            
            <Route exact path="/new"  component={NewEditItemView} />
            <Route exact path="/new/:id/comment"  component={NewEditItemView} />
            <Route exact path="/edit/:id" component={NewEditItemView} />
            <Route exact path="/edit/:id/comment/:comment_id" component={NewEditItemView} />
            { this.props.categories.map((category) => (<Route exact path={"/" + category.path} key={category.path} component={ListView} />)) }            
            { this.props.categories.map((category) => (<Route exact path={"/" + category.path + "/:id"} key={category.path + "_id"} component={ItemView} />)) }
          </div>
        </div>
    </BrowserRouter>
    );
  }
}

const mapStateToProps = (state, props) => ({
  categories: state.categories,
  categories_loaded: state.categories_loaded
});
const mapDispatchToProps = (dispatch) => ({
  setCategories: (data) => dispatch(setCategories(data)),
  selectCategory: (data) => dispatch(selectCategory(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
