import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Navigation from '../Navigation'
import '../NotFound/NotFound.css'

export default function Cancel() {
  const history = useHistory();

  useEffect(() => {
    const asyncFunc = async () => {
      await setTimeout(() => {
        return history.push('/dashboard');
      }, 3000)
    }
    asyncFunc();
  }, [])

  return (
    <>
      <Navigation />
      <div className="not-found-page-container">
        <div className="not-found-page-body">
          <h1>Transaction Cancelled</h1>
        </div>
      </div>
    </>
  ) 
}
