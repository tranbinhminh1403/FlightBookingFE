import './App.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { SearchResultsProvider } from './context/SearchResultsContext'

function App() {
  return (
    <SearchResultsProvider>
      <RouterProvider router={router} />
    </SearchResultsProvider>
  )
}

export default App
