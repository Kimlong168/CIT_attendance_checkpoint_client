import { createContext, useReducer } from "react";
import PropTypes from "prop-types";

const initialState = {
  clientVisitLogs: [],
};

const clientVisitLogsReducer = (state, action) => {
  switch (action.type) {
    case "SET_CLIENT_VISIT_LOGS":
      return {
        ...state,
        clientVisitLogs: action.payload,
      };
    case "DELETE_CLIENT_VISIT_LOG":
      return {
        ...state,
        clientVisitLogs: state.clientVisitLogs.filter(
          (request) => request._id !== action.payload
        ),
      };
    case "SEARCH_CLIENT_VISIT_LOG":
      return {
        ...state,
        clientVisitLogs: action.payload,
      };

    default:
      return state;
  }
};

export const ClientVisitLogContext = createContext();

export const ClientVisitLogtProvider = ({ children }) => {
  const [state, dispatch] = useReducer(clientVisitLogsReducer, initialState);

  const setItems = (payload) => {
    dispatch({ type: "SET_CLIENT_VISIT_LOGS", payload });
  };

  const removeClientVisitLog = (payload) => {
    dispatch({ type: "DELETE_CLIENT_VISIT_LOG", payload });
  };

  const searchClientVisitLog = (payload) => {
    const filteredClientVisitLog = state.clientVisitLogs.filter(
      (request) =>
        request._id.toLowerCase().includes(payload.toLowerCase()) ||
        request.employee?.name.toLowerCase().includes(payload.toLowerCase()) ||
        request.purpose.toLowerCase().includes(payload.toLowerCase()) ||
        request.agentName.toLowerCase().includes(payload.toLowerCase()) ||
        request.notes.toLowerCase().includes(payload.toLowerCase())
    );

    dispatch({
      type: "SEARCH_CLIENT_VISIT_LOG",
      payload: filteredClientVisitLog,
    });

    if (payload === "") {
      setItems(state.clientVisitLogs);
    }
  };

  return (
    <ClientVisitLogContext.Provider
      value={{
        state: state.clientVisitLogs,
        setItems,
        removeClientVisitLog,
        searchClientVisitLog,
        dispatch,
      }}
    >
      {children}
    </ClientVisitLogContext.Provider>
  );
};

ClientVisitLogtProvider.propTypes = {
  children: PropTypes.node,
};
