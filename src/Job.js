import { useState } from "react";
import { Card, Badge, Button, Collapse } from "react-bootstrap";
import ReactMarkdown from "react-markdown";

const Job = (props) => {
  const [open, setOpen] = useState(false);
  const {
    title,
    company,
    created_at,
    type,
    location,
    how_to_apply,
    company_logo,
    description,
  } = props.job;

  console.log(props.job);
  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between">
          <div>
            <Card.Title>
              {title} -
              <span className="text-muted font-weight-light">{company}</span>
            </Card.Title>
            <Card.Subtitle className="text-muted mb-2">
              {new Date(created_at).toLocaleDateString()}
            </Card.Subtitle>
            <Badge variant="secondary" className="mr-2">
              {type}
            </Badge>
            <Badge variant="secondary">{location}</Badge>
            <div style={{ wordBreak: "break-all" }}>
              <ReactMarkdown source={how_to_apply} />
            </div>
          </div>

          <img
            className="d-none d-md-block"
            height="50"
            alt={company}
            src={company_logo}
          />
        </div>
        <Card.Text>
          <Button
            variant="primary"
            onClick={() => setOpen((prevOpen) => !prevOpen)}
          >
            {" "}
            {open ? "Hide details" : "View Details"}
          </Button>
          <Collapse in={open}>
            <div className="mt-4">
              <ReactMarkdown source={description} />
            </div>
          </Collapse>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};
export default Job;
