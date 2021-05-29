import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { highlander } from '../dist';

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

export default ModalExample;
