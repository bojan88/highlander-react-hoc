import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { highlander, prioritizedHighlander } from '../dist';

interface IValueContext { value: string; setData: Function | undefined };
const DataContext = React.createContext<IValueContext>({
  value: '',
  setData: undefined,
});

const FetchSomeDataComponent = highlander(() => {
  const { setData } = React.useContext(DataContext);

  React.useEffect(() => {
    // this will be executed only once
    // highlander HOC will only allow the first component to be mounted
    setTimeout(() => {
      console.log('fetching!');
      setData?.('fetched value');
    }, 1000);
  }, []);

  return null;
});

const SomeComponent = () => {
  const { value } = React.useContext(DataContext);
  return (
    <div>
      <FetchSomeDataComponent />
      <div>this is our value {value}</div>
    </div>
  );
};

const PrioritizedComponent = prioritizedHighlander(({ ind }) => (
  <div>prioritized component {ind}</div>
));

const App = () => {
  const [value, setData] = React.useState('');

  return (
    <DataContext.Provider value={{ value, setData }}>
      <div>
        <h4>Please check your console</h4>
        <p>You should see "fetching!" logged only once</p>

        <SomeComponent />
        <SomeComponent />
        <SomeComponent />

        <PrioritizedComponent priority={1} ind={1} />
        {/* only component with higher priority should be rendered */}
        <PrioritizedComponent priority={2} ind={2} />
      </div>
    </DataContext.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
