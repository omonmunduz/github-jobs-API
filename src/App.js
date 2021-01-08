import "./App.css";
import { useState } from "react";
import useFetchJobs from "./useFetchJobs";
import { Container } from "react-bootstrap";
import Job from "./Job";
import JobsPagination from './JobsPagination';
import SearchForm from './SearchForm';

function App() {
  const [params, setParams] = useState({});
  const [page, setPage] = useState(1);
  const { jobs, loading, error, hasNextPage } = useFetchJobs(params, page);

  function handleParamChange(e) {
    const param = e.target.name;
    const value = e.target.value;
    setPage(1);
    setParams( prevParams => {
      return {...prevParams, [param]: value}
    })
  }
  return (
    <Container className="my-4">
      <h1 className="mb-4">Github Jobs</h1>
      <JobsPagination page={page} setPage={setPage} hasNextPage={hasNextPage}/>
      <SearchForm params={params} onParamChange={handleParamChange} />
      {loading && <h1>Loading ...</h1>}
      {error && <h1>Error! Try refreshing.</h1>}
      <div>
        {jobs.length &&
          jobs.map((job) => {
            return <Job key={job.id} job={job} />;
          })}
      </div>
      <JobsPagination page={page} setPage={setPage} hasNextPage={hasNextPage}/>
    </Container>
  );
}

export default App;
