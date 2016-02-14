import React from "react";
import ReactDOM from "react-dom";
import App from "./views/App/App";
import alt from "./alt";
import TaskStore from "./stores/TaskStore";
import TaskActions from "./actions/TaskActions";

import "./style/normalize.css";
import "./style/main.scss";


if(window.localStorage.taskStoreData)
	TaskActions.setTasks(JSON.parse(window.localStorage.taskStoreData));
	
TaskStore.listen((state) => {
	window.localStorage.taskStoreData = JSON.stringify(state.tasks);
});

ReactDOM.render(
	<App />,
  	document.getElementById("mount")
);
