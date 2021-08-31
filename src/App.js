import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import './App.css';
import { Calculator } from './components';
import { Top } from './context';

export default function App() {
    return (
        <div className="App">
            <Top />
            <BrowserRouter><Switch>
            <Route exact path="/calculator"
                render={props => <Calculator {...props} /> }
            />

            <Route exact path="/"><Redirect to="/calculator"/></Route>
            
            </Switch></BrowserRouter>
        </div>
    );
}