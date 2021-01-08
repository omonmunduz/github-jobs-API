import { useReducer, useEffect } from "react";
import axios from "axios";

const ACTIONS = {
  MAKE_REQUEST: "make-request",
  GET_DATA: "get-data",
  ERROR: "error",
  UPDATE_HAS_NEXT_PAGE: 'update-has-next-page'
};

const BASE_URL =
  "https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json";

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.MAKE_REQUEST:
      return { loading: true, jobs: [] };
    case ACTIONS.GET_DATA:
      return { ...state, loading: false, jobs: action.payload.jobs };
    case ACTIONS.ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        jobs: [],
      };
    case ACTIONS.UPDATE_HAS_NEXT_PAGE:
        return {...state, hasNextPage: action.payload.hasNextPage}
    default:
      return state;
  }
}

export default function useFetchJobs(params, page) {
  const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true });

  useEffect(() => {
    // To cancel requests if params are chaging too often. To avoid unnecessary requests
    const cancelToken1 = axios.CancelToken.source();
    const cancelToken2 = axios.CancelToken.source();
    dispatch(ACTIONS.MAKE_REQUEST);
    axios(BASE_URL, {
      cancelToken1: cancelToken1.token,
      params: { markdown: true, page: page, ...params },
    })
      .then((res) => {
        dispatch({ type: ACTIONS.GET_DATA, payload: { jobs: res.data } });
      })
      .catch((e) => {
        // cancel will trigger error , thus provide logic for ignoring catch if error is due to canceling
        if (axios.isCancel(e)) return;
        dispatch({ type: ACTIONS.ERROR, payload: { error: e } });
      });

      axios(BASE_URL, {
        cancelToken2: cancelToken2.token,
        params: { markdown: true, page: page + 1, ...params },
      })
        .then((res) => {
          dispatch({ type: ACTIONS.UPDATE_HAS_NEXT_PAGE, payload: { hasNextPage: res.data } });
        })
        .catch((e) => {
          // cancel will trigger error , thus provide logic for ignoring catch if error is due to canceling
          if (axios.isCancel(e)) return;
          dispatch({ type: ACTIONS.ERROR, payload: { error: e } });
        });

    return () => {
      cancelToken1.cancel();
      cancelToken2.cancel();
    };
  }, [params, page]);

  return state;
}
