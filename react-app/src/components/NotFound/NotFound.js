import Navigation from '../Navigation'
import './NotFound.css'

export default function NotFound() {
  return (
    <>
      <Navigation />
      <div className="not-found-page-container">
        <div className="not-found-page-body">
          <h1>Page Not Found</h1>
        </div>
      </div>
    </>
  ) 
}
