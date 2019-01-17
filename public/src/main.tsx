import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const Index = () => <h2>Home</h2>;
const Switches = () => <h2>Switches</h2>;
const ContributionTypes = () => <h2>Contribution Types</h2>;
const Amounts = () => <h2>Amounts</h2>;

const AppRouter = () => (
  <Router>
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/switches/">Switches</Link>
          </li>
          <li>
            <Link to="/contribution-types/">Contribution Types</Link>
          </li>
          <li>
            <Link to="/amounts/">Amounts</Link>
          </li>
        </ul>
      </nav>

      <Route path="/" exact component={Index} />
      <Route path="/switches/" component={Switches} />
      <Route path="/contribution-types/" component={ContributionTypes} />
      <Route path="/amounts/" component={Amounts} />
    </div>
  </Router>
);

ReactDOM.render(
  <AppRouter />,
  document.getElementById('root')
);
