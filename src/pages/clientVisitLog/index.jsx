import ClientVisitLog from "./ClientVisitLog";
import { ClientVisitLogtProvider } from "@/contexts/ClientVisitLog";
const index = () => {
  return (
    <ClientVisitLogtProvider>
      <ClientVisitLog />
    </ClientVisitLogtProvider>
  );
};

export default index;
