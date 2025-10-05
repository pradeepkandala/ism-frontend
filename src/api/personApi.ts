import api from "./axiosClient";
import type { Person } from "../models/Person";

export const PersonApi = {
  getAll: async (): Promise<Person[]> => {
    const res = await api.get("/persons");
    return res.data;
  },

  create: async (person: Person): Promise<Person> => {
    const res = await api.post("/persons", person);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/persons/${id}`);
  },
};
