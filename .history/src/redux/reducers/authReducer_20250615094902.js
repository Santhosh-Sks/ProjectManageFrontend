const initialState = {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    emailForOTP: null,
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'AUTH_REQUEST':
        return { ...state, loading: true };
      case 'AUTH_SUCCESS':
        return { ...state, user: action.payload.user, token: action.payload.token, loading: false };
      case 'AUTH_FAILURE':
        return { ...state, error: action.payload, loading: false };
      case 'SAVE_EMAIL_FOR_OTP':
        return { ...state, emailForOTP: action.payload };
      case 'LOGOUT':
        localStorage.removeItem('token');
        return { ...initialState, token: null };
      default:
        return state;
    }
  };
  
  export default authReducer;
  