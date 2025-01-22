import axios from 'axios';
import jwt_decode from "jwt-decode";


// axios.defaults.baseURL = process.env.REACT_APP_API_URL;
// console.log('process.env.API_URL', process.env.REACT_APP_API_URL)


// הגדרת URL של ה-API כערך ברירת מחדל
//axios.defaults.baseURL = "http://localhost:5238";
axios.defaults.baseURL =  "https://todolist-server-4o34.onrender.com" //|| process.env.REACT_APP_API_URL;
setAuthorizationBearer();



function saveAccessToken(authResult) {
  localStorage.setItem("access_token", authResult.token);
  setAuthorizationBearer();
}

function setAuthorizationBearer() {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }
  console.log("accessToken",accessToken);
}



axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {

    if (error.response.status === 401) {
      return (window.location.href = "/login");
    }
    console.error("Axios Error:", error.response || error.message);


    return Promise.reject(error);
  }
);

const apiService = {
  getLoginUser: () => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      return jwt_decode(accessToken);
    }
    return null;
  },

  logout:()=>{
    localStorage.setItem("access_token", "");
  },

  register: async (email, password) => {
    const res = await axios.post("/register", { email, password });
    saveAccessToken(res.data);
  },

  login: async (email, password) => {
    const res = await axios.post("/login", { email, password });
    saveAccessToken(res.data);
  },




  // getTasks: async () => {
  //   const result = await axios.get('/items');
  //   return result.data;
  // },
  getTasks: async () => {
    const loginUser = apiService.getLoginUser(); // קבלת המידע מתוך ה-Token
    if (!loginUser || !loginUser.id) {
      window.location.href = "/login";
    return;
    }
  
    // שליחה של UserId בשורת השאילתה
    const result = await axios.get(`/items?userId=${loginUser.id}`);
    return result.data;
  },
  
  addTask: async (name) => {
    const loginUser = apiService.getLoginUser(); // קבלת המידע מתוך ה-Token
    if (!loginUser || !loginUser.id) {
      window.location.href = "/login";
    return;
    }
  
    const newItem = { 
      name, 
      isComplete: false, 
      userId: loginUser.id // הוספת UserId
    };
  
    const result = await axios.post('/items', newItem);
    return result.data;
  },
  

  setCompleted: async (id, isComplete) => {
    const loginUser = apiService.getLoginUser();
    if (!loginUser || !loginUser.id) {
      window.location.href = "/login";
    return;
    }
    const updatedItem = { 
      isComplete, 
      userId: loginUser.id // הוספת UserId
    };
  
    await axios.put(`/items/${id}`, updatedItem);
    return { success: true };
  },
  

  deleteTask: async (id) => {
    const loginUser = apiService.getLoginUser();
    if (!loginUser || !loginUser.id) {
      window.location.href = "/login";
    return;
    }
  
    await axios.delete(`/items/${id}`, {
      data: { userId: loginUser.id } 
    });
    return { success: true };
  }
  
};

export default apiService;
