const userId =
"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTY4MDQ1NzA3NSwiZXhwIjoxNjgwNDYwNjc1LCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay10bTB4eEB2aW50YWdlYXBpLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstdG0weHhAdmludGFnZWFwaS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInVpZCI6Ijg5eDhGZnBaTXFSNUprNGpBZ0FrRHVjaUFLZDIifQ.zs9b3D-e1mfQih91wEnv9dG5Ya0sJX2a3KNRdbf1yKJ51jVkDMh8I9-gmnaAleVoODz4KvVY8GoSSQtfcqRcHxr-R0PaU51NISSwbbMRt1IFah6xo_FjLsrRmF55wsoXt8YK6yl49CfxNJ9lkxzPriXC3HN6tBJs6HYZsliHpLocbBoPV5mQn0CGK4VqOnJf01nteU6V-1YGgtzc64_NQHpmISOH7voZUfLyBfuo9FG1QUbfVQMGAbhhWlGAUZ6PWsoV-0VxqKBkVm-pDQbYHabAqQxij0LiVaMd0uw6P_gWrPWekrhkyFzFovriPomJ2DrU2nqVxKNzPE-SGQ-pzA";
const url = "http://localhost:8080/api/books";
const options = {
  headers: {
    Authorization: `Bearer ${userId}`,
  },
};
const app = async () => {
  const res = await fetch(url, options);
  const data = await res.json();
  console.log(data);
};
app();
