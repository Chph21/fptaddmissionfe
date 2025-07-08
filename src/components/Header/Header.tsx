import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slice/authSlice';
import { User, LogOut } from 'lucide-react';
import logo from '../../assets/Logo_Trường_Đại_học_FPT.svg.png';
import './Header.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <div className="logo">
              <Link to="/">
                <img src={logo} alt="FPT University" />
              </Link>
            </div>
            <div className="header-right">
              {isAuthenticated && user ? (
                <div className="user-section">
                  <div className="user-info">
                    <User className="user-icon" />
                    <span className="user-name">{user.name}</span>
                  </div>
                  <button 
                    id="logout-btn"
                    onClick={handleLogout} 
                    className="auth-btn logout-btn"
                  >
                    <LogOut className="logout-icon" />
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="auth-btn login-btn">
                    Đăng nhập
                  </Link>
                  <Link to="/register" className="auth-btn register-btn">
                    Đăng ký
                  </Link>
                </div>
              )}
              <div className="language-switch">
                <button id="lang-vi" className="lang-btn active">VI</button>
                <button id="lang-en" className="lang-btn">EN</button>
              </div>
              <div className="search-box">
                <input 
                  id="search-input"
                  name="search"
                  type="text" 
                  placeholder="Tìm kiếm..." 
                />
                <button id="search-btn" type="button">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <nav className="main-nav">
        <div className="container">
          <button id="mobile-menu-btn" className="mobile-menu-btn" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/gioi-thieu">Giới thiệu</Link></li>
            <li><Link to="/tin-tuc">Tin tức & Sự kiện</Link></li>
            <li><Link to="/nganh-hoc">Ngành học</Link></li>
            <li><Link to="/tuyen-sinh">Tuyển sinh</Link></li>
            <li><Link to="/trai-nghiem">Trải nghiệm toàn cầu</Link></li>
            <li><Link to="/sinh-vien">Sinh viên</Link></li>
            <li><Link to="/cuu-sinh-vien">Cựu Sinh viên</Link></li>
            <li><Link to="/lien-he">Liên hệ</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header; 