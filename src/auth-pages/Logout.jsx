import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Perform logout operations
        Cookie.remove('accessToken');
        Cookie.remove('studentId')
        localStorage.clear();
        
        // Navigate to home with logout parameter
        navigate('/?logout=success');
        
    }, [navigate]);

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
            <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Logging out...</span>
                </div>
                <p className="mt-3">Logging out...</p>
            </div>
        </div>
    );
};

export default Logout;