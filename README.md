# Highlander React HOC

There can be only one (component in DOM)!

---

Higher order component that allows only one component of the same type to be rendered.

## Use cases

1. Fire some side effects, and prevent repetition if you have multiple instances of the same component. Example:

```
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
```

2. Render a single component even though you have multiple components in your tree. Example:

```
const Context = React.createContext();

const Modal = highlander(() => (
  <div>this is our modal</div>
));

const SomeComponent = () => {
  const { modalOpen, setModalOpen } = React.useContext(Context);
  return (
    <div>
      {modalOpen && <Modal />}
      <button onClick={() => setModalOpen(true)}>Open modal</button>
    </div>
  );
};

const ModalExample = () => {
  const [modalOpen, setModalOpen] = React.useState();
  return (
    <Context.Provider value={{ modalOpen, setModalOpen }}>
      <SomeComponent />
      <SomeComponent />
      <SomeComponent />
    </Context.Provider>
  );
};
```

Full example implementation available in [examples folder](https://github.com/bojan88/highlander-react-hoc/tree/master/example)

