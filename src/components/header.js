import React, { Component } from 'react';
import styles from '../css/header.module.css'

class Header extends Component {
  render() {
    return (
      <div className={styles.header}>
        <h2> Welcome to Carlo's Site</h2>
          <p>Not much 
             here except a collection of videos, through which I hope you
             can get to know me a little better. Eventually all my projects will
             be on this site. I will be adding content
             as time permits. You can take a look at the source code at:&nbsp;
             <a href="https://github.com/carloruiz/mysite"> 
               https://github.com/carloruiz/mysite
             </a>
          </p>
        <hr/>
      </div>
    )
  }
}

export default Header

