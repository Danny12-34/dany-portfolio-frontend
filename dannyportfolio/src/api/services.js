import axios from "axios";

const API_BASE_URL = import.meta.env.REACT_APP_API_URL || "dany-portfolio-backend-production.up.railway.app/api";

const apiClient = axios.create({ baseURL: API_BASE_URL });

const preparePayload = (data) => {
  const hasFile = Object.values(data).some(
    (val) => val instanceof File || (Array.isArray(val) && val[0] instanceof File)
  );

  if (!hasFile) return { payload: data, headers: { "Content-Type": "application/json" } };

  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (Array.isArray(data[key])) {
      data[key].forEach((item) => {
        if (item instanceof File) formData.append(key, item);
      });
    } else if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  return { payload: formData, headers: { "Content-Type": "multipart/form-data" } };
};

const createCrudService = (endpoint) => ({
  getAll: async () => (await apiClient.get(endpoint)).data,
  getById: async (id) => (await apiClient.get(`${endpoint}/${id}`)).data,
  create: async (data) => {
    const { payload, headers } = preparePayload(data);
    return (await apiClient.post(endpoint, payload, { headers })).data;
  },
  update: async (id, data) => {
    const { payload, headers } = preparePayload(data);
    return (await apiClient.put(`${endpoint}/${id}`, payload, { headers })).data;
  },
  delete: async (id) => (await apiClient.delete(`${endpoint}/${id}`)).data,
});

export const ProfileService = createCrudService("/profile");
export const SkillsService = createCrudService("/skills");
export const EducationService = createCrudService("/education");
export const ExperienceService = createCrudService("/experience");
export const ProjectsService = createCrudService("/projects");
export const CertificationsService = createCrudService("/certifications");
export const LanguagesService = createCrudService("/languages");
export const ReferencesService = createCrudService("/references");
export const OtherDocumentsService = createCrudService("/otherdocuments");