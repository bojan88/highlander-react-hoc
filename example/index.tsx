import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { prioritizedHighlander } from '../dist';
import FetchExample from './FetchExample';
import ModalExample from './ModalExample';

const PrioritizedComponent = prioritizedHighlander(({ ind }) => (
  <div>prioritized component {ind}</div>
));

const App = () => (
  <div>
    <h4>Please check your console</h4>
    <p>You should see "fetching!" logged only once</p>

    <FetchExample />
    <br />
    <ModalExample />
    <br />

    <PrioritizedComponent priority={1} ind={1} />
    {/* only component with higher priority should be rendered */}
    <PrioritizedComponent priority={2} ind={2} />
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));
