import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { highlander } from '../dist';

const Context = React.createContext();

const FetchSomeDataComponent = highlander(() => {
  const { setData } = React.useContext(Context);

  React.useEffect(() => {
    // this will be executed only once
    // highlander HOC will only allow the first component to be mounted
    setTimeout(() => {
      console.log('fetching!');
      setData('fetched value');
    }, 1000);
  }, []);

  return null;
});

const SomeComponent = () => {
  const { value } = React.useContext(Context);
  return (
    <div>
      <FetchSomeDataComponent />
      <div>this is our {value}</div>
    </div>
  );
};

const FetchExample = () => {
  const [value, setData] = React.useState('');
  return (
    <Context.Provider value={{ value, setData }}>
      <SomeComponent />
      <SomeComponent />
      <SomeComponent />
    </Context.Provider>
  );
};

export default FetchExample;
