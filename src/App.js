import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import './App.css';
import { BlackScholesModel } from "./components";
import { Top } from './context';

export default function App() {
    return (
        <div className="App">
            <Top />
            <BrowserRouter><Switch>
            <Route exact path="/calculators/black-scholes"
                render={props => <BlackScholesModel {...props} /> }
            />

            <Route exact path="/"><Redirect to="/calculators/black-scholes"/></Route>
            
            </Switch></BrowserRouter>
        </div>
    );
}