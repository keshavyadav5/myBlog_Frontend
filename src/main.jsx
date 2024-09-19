import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { store, persistor } from './redux/Store.jsx'
import { PersistGate } from 'redux-persist/integration/react'
import ThemeProvider from './components/ThemeProvider.jsx'

createRoot(document.getElementById('root')).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>,
  </PersistGate>
)
