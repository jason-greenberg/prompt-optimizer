import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { ModalProvider, Modal } from "./context/Modal";
import configureStore from "./store";
import * as sessionActions from "./store/session";
import * as resumeActions from "./store/resume";
import * as coverLetterActions from "./store/coverletter";
import * as applicationActions from "./store/application";
import * as correspondenceActions from "./store/correspondence";
import * as jobsActions from "./store/job"
import * as searchActions from "./store/search"
import App from "./App";

import "./index.css";
import MenuSelectionProvider from "./context/Menu";

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
	window.store = store;
	window.sessionActions = sessionActions;
	window.resumeActions = resumeActions;
	window.coverLetterActions = coverLetterActions;
	window.applicationActions = applicationActions;
	window.correspondenceActions = correspondenceActions;
	window.jobsActions = jobsActions;
	window.searchActions = searchActions;
}

// Wrap the application with the Modal provider and render the Modal component
// after the App component so that all the Modal content will be layered as
// HTML elements on top of the all the other HTML elements:
function Root() {
	return (
		<MenuSelectionProvider>
			<ModalProvider>
				<Provider store={store}>
					<BrowserRouter>
						<App />
						<Modal />
					</BrowserRouter>
				</Provider>
			</ModalProvider>
		</MenuSelectionProvider>
	);
}

ReactDOM.render(
	<React.StrictMode>
		<Root />
	</React.StrictMode>,
	document.getElementById("root")
);
