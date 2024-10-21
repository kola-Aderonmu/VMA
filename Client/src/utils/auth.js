import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await axios.post(`${API_URL}/auth/refresh-token`, {
      refreshToken,
    });
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    setAuthToken(accessToken);
    return accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    logout();
    window.location.href = "/login";
  }
};

export const setupInterceptors = (navigate) => {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const accessToken = await refreshToken();
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          navigate("/login");
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  setAuthToken(null);
};
