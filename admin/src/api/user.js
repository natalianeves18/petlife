import { api } from "./api";

export const loginUser = async ({ email, password }) =>
  api
    .post("/admin/login", { email, password })
    .then((resp) => {
      api.defaults.headers.common["Authorization"] = resp.data.token;
      localStorage.setItem("token", resp.data.token);
      window.location.replace(window.location.origin);
      return resp.data;
    })
    .catch((err) => {
      console.error(err);
    });

export const amIAlive = () => {
  api.defaults.headers.common["Authorization"] = localStorage.token;
  return api
    .get("/")
    .then((r) => r.data)
    .catch(console.log);
};

export const logoutUser = async (user) => {
  api.defaults.headers.common["Authorization"] = null;
  localStorage.setItem("token", null);
  return window.location.replace(window.location.origin);
};

export const registerUser = async (user) =>
  api
    .post("/register", user)
    .then((resp) => resp)
    .catch((err) => {
      console.error(err);
    });

export const getAllUsers = async () =>
  api
    .get("/admin/results")
    .then((r) => r.data)
    .catch(console.log);

export const registerResult = async (exam) =>
  api
    .post("/result/create", exam)
    .then((resp) => {
      return resp.data;
    })
    .catch((err) => {
      console.error(err);
    });

export const updateResult = async (exam) =>
  api
    .put("/result/update", exam)
    .then((resp) => {
      console.log(resp);
      return resp.data;
    })
    .catch((err) => {
      console.error(err);
    });

export const deleteResult = async ({ id }) => {
  console.log(id);
  return api
    .delete(`/result/delete/${id}`)
    .then((resp) => {
      console.log(resp);
      return resp.data;
    })
    .catch((err) => {
      console.error(err);
    });
};

export const uploadImage = async (file) =>
  api
    .post("/image/register", file, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data)
    .catch(console.log);

export const registerAppointment = async (appointment) =>
  api
    .post("/consulta/create", appointment)
    .then((resp) => {
      return resp.data;
    })
    .catch((err) => {
      console.error(err);
    });

export const updateAppointment = async (appointment) =>
  api
    .put("/consulta/update", appointment)
    .then((resp) => {
      console.log(resp);
      return resp.data;
    })
    .catch((err) => {
      console.error(err);
    });

export const deleteAppointment = async ({ id }) => {
  console.log(id);
  return api
    .put(`/consulta/cancel/${id}`)
    .then((resp) => {
      console.log(resp);
      return resp.data;
    })
    .catch((err) => {
      console.error(err);
    });
};

export const getAllAppointmentsUsers = async () =>
  api
    .get("/admin/appointments")
    .then((r) => r.data)
    .catch(console.log);
