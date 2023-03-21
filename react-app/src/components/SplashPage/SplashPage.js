import { NavLink } from 'react-router-dom';
import './SplashPage.css';

export default function SplashPage() {
  return (
    <div className="splash-page-container">
      <div className="splash-nav-container">
        <div className="splash-nav-left">zipcover</div>
        <div className="splash-nav-right">
          <NavLink to='/coming-soon'>Product</NavLink>
          <NavLink to='/coming-soon'>Pricing</NavLink>
          <NavLink to='/coming-soon'>Blog</NavLink>
          <NavLink to='/coming-soon'>Docs</NavLink>
          <NavLink to='/coming-soon'>Careers</NavLink>
          <NavLink to='/dashboard'><button>DASHBOARD</button></NavLink>
        </div>
      </div>
    </div>
  )
}
