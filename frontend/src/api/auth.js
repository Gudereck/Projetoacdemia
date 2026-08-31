import client from "./client";

export function login(email, senha) {
  return client.post("/auth/login", { email, senha }).then((res) => res.data);
}

export function me() {
  return client.get("/auth/me").then((res) => res.data);
}
