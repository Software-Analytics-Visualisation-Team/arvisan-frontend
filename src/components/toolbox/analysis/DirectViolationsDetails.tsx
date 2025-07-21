import { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong, faBinoculars } from '@fortawesome/free-solid-svg-icons';
import { GraphHighlightContext } from '../../../context';
import { ExtendedSimpleEdgeData } from '../../../api';

interface Props {
  violations: ExtendedSimpleEdgeData[];
  onHighlight?: () => void;
}

export default function DirectViolationsDetails({ violations, onHighlight }: Props) {
  const { highlightEdges } = useContext(GraphHighlightContext);

  const handleHighlight = (d: ExtendedSimpleEdgeData) => {
    highlightEdges([d]);
    if (onHighlight) onHighlight();
  };

  const renderDirectViolation = (violation: ExtendedSimpleEdgeData) => (
    <div>
      <h5 className="d-flex flex-wrap align-items-center gap-2">
        <Button
          title="Show this violating dependency in visualization"
          onClick={() => handleHighlight(violation)}
        >
          <FontAwesomeIcon icon={faBinoculars} size="sm" />
        </Button>
        {/* <div>Rendered dependency:</div> */}
        <div className="">
          {violation.sourceNode.label}
          {' '}
          <FontAwesomeIcon icon={faArrowRightLong} />
          {' '}
          {violation.targetNode.label}
        </div>
      </h5>
    </div>
  );

  if (violations.length === 0) {
    return (
      <span className="fst-italic">
        No refernce architecture violations were found.
      </span>
    );
  }

  return violations.map((l, i) => {
    if (i === 0) return renderDirectViolation(l);
    return (
      <div key={l.id}>
        <hr />
        {renderDirectViolation(l)}
      </div>
    );
  });
}

DirectViolationsDetails.defaultProps = ({
  onHighlight: undefined,
});
