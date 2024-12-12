import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosClient from "../../api/axiosClient";

export const useClientVisitLogs = () => {
  return useQuery(
    "clientVisitLogs",
    async () => {
      const response = await axiosClient.get(`/client-visit-log`);
      console.log("response result:", response.data);
      return response.data;
    },
    {
      select: (response) => {
        const formatedData = response.data;
        return formatedData;
      },
    }
  );
};

export const useClientVisitLog = (id) => {
  return useQuery(
    ["clientVisitLog", id],
    async () => {
      const response = await axiosClient.get(`/client-visit-log/${id}`);
      return response.data;
    },
    {
      select: (response) => {
        const formatedData = response.data;
        return formatedData;
      },
    }
  );
};

export const useClientVisitLogsByEmployeeId = (id) => {
  return useQuery(
    ["clientVisitLog", id],
    async () => {
      const response = await axiosClient.get(
        `/client-visit-log/employee/${id}`
      );
      return response.data;
    },
    {
      select: (response) => {
        const formatedData = response.data;
        return formatedData;
      },
    }
  );
};

export const useCreateClientVisitLog = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (request) => {
      const response = await axiosClient.post(`/client-visit-log`, request);

      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("clientVisitLogs");
      },
    }
  );
};

export const useUpdateClientVisitLog = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (request) => {
      const response = await axiosClient.put(
        `/client-visit-log/${request.id}`,
        request
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("clientVisitLogs");
      },
    }
  );
};

export const useDeleteClientVisitLog = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id) => {
      const response = await axiosClient.delete(`/client-visit-log/${id}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("clientVisitLogs");
      },
    }
  );
};

export const useClearAllClientVisitLogs = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async () => {
      const response = await axiosClient.delete(`/client-visit-log/clear-all`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("clientVisitLogs");
      },
    }
  );
};
