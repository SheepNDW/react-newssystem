import IndexRouter from './router/IndexRouter'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'

import './App.css'

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <IndexRouter></IndexRouter>
      </HashRouter>
    </Provider>
  )
}

export default App
