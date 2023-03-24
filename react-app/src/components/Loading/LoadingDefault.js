import Navigation from '../Navigation'
import './LoadingDefault.css'
import loadingGif from './assets/loading.gif'

export default function LoadingDefault() {
  return (
    <>
      <div className="loading-page-container">
        <div className="loading-page-body">
          <img className="loading-gif" src={loadingGif} alt="loading-gif" />
        </div>
      </div>
    </>
  )
}
