import * as React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { ReactComponent as Logo } from './assets/logo/logo-col.svg';
import InstructionsContainer from './onboarding/Instructions';
import './App.css';

class Home extends React.Component<{}, {}> {
  public render(): React.ReactElement {
    return (
      <header className="App-header">
        <h1>立爱识字</h1>
        <Logo className="App-logo" />
        <p>(with react.js)</p>
      </header>
    );
  }
}

class About extends React.Component<{}, {}> {
  public render(): React.ReactElement {
    return <h1>About</h1>;
  }
}

class App extends React.Component {
  public render(): React.ReactElement {
    return (
      <Router>
        <div className="App">
          <nav>
            <Link to="/">Home </Link> |
            <Link to="/instructions"> Instructions </Link> |
            <Link to="/about"> About</Link>
          </nav>
          <Switch>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/instructions">
              <InstructionsContainer />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
