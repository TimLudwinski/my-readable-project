import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { selectCategory } from '../actions'

class CategoriesSidebar extends Component {
  render() {
    return (
      <div className="Categories-Nav">
        <ul>
          <li key={"ALL_CATEGORIES"}>{ this.props.current_category === "" ? "All Categories" : ( <Link onClick={(e) => { this.props.selectCategory(""); } } to="/">All Categories</Link> ) }</li>
          {this.props.categories.map( (category) => (
            <li key={category.path}>
              { this.props.current_category === category.path ? category.name : ( <Link onClick={(e) => { this.props.selectCategory(category.path); } } to={"/" + category.path} >{category.name}</Link> ) }
            </li>)
          )}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  current_category: state.current_category,
  categories: state.categories
});

const mapDispatchToProps = (dispatch) => ({
  selectCategory: (data) => dispatch(selectCategory(data))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CategoriesSidebar))
