import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViNWM4MTVkLTYwYTItNDM3Yy05Yjc4LTA0ZDc5YTk2YWE3YyIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc1MjcyMDc5NCwiZXhwIjoxNzUyODA3MTk0fQ.y9nnYHKswKXiHnKwJlQuKdZDujfQ0C0ybZGWjdkz9_Y`,
  },
});

export default api;
