import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import TaskHomepage from './TaskHomepage';
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
import {Route, Switch,BrowserRouter as Router} from "react-router-dom";
import NewTaskScreen from "./NewTaskScreen";
import TaskDetailScreen from "./TaskDetailScreen";


ReactDOM.render(
  <React.StrictMode>
    <Router>
        <Switch>
            <Route exact path="/" component={TaskHomepage}/>
            <Route exact path="/login" component={App}/>
            <Route exact path="/home" component={TaskHomepage}/>
            <Route exact path="/new/task" component={NewTaskScreen}/>
            <Route exact path="/task/details" component={TaskDetailScreen}/>
        </Switch>
        <div className="position-static App my-5">
            <h2 className="" style={{fontSize:'14px'}}>Designed &amp; Developed by KWIZERA Emile</h2>
        </div>
    </Router>
  </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
