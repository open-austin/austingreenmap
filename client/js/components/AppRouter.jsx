import React from 'react';

export default class AppRouter extends React.Component {

  componentWillMount() {
       window.addEventListener('hashchange', this.onHashChange.bind(this));
   }

   componentDidUnmount() {
       window.removeEventListener('hashchange', this.onHashChange.bind(this));
   }

   onHashChange() {
      this.props.selectParkWithId(window.location.hash.substring(1));
   }

   render () {
     return null;
   }

}

AppRouter.propTypes = {
  selectParkWithId: React.PropTypes.func.isRequired
}
