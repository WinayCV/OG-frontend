import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {BrowserRouter} from 'react-router-dom';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import {Provider} from 'react-redux';
import {configStore} from './store/configureStore.jsx';
const store = configStore();
console.log(store.getState());
store.subscribe(() => {
  console.log(store.getState());
});
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);
