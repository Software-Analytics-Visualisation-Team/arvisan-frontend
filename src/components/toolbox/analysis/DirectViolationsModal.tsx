import { Modal } from 'react-bootstrap';
import { useContext } from 'react';
import { ViolationModalProps } from './ViolationList';
import { ExtendedSimpleEdgeData } from '../../../api';
import DirectViolationsDetails from './DirectViolationsDetails';
import { ViolationsContext } from '../../../context';
import { VisibilityOptions } from '../../../helpers/enums';

export default function DirectViolationsModal({
  selectedGroup, onClose,
}: ViolationModalProps<ExtendedSimpleEdgeData>) {
  const { setVisibility } = useContext(ViolationsContext);

  const directViolations = selectedGroup?.items;
  const label = selectedGroup?.label;
  const count = selectedGroup?.items.length || 0;

  const onHighlight = () => {
    setVisibility((visibility) => {
      const v = { ...visibility };
      if (v.directViolations === VisibilityOptions.INVISIBLE) {
        v.directViolations = VisibilityOptions.HIGHLIGHTED;
      }
      return v;
    });
  };

  const modalContent = () => {
    if (!directViolations) return null;
    return (
      <DirectViolationsDetails
        violations={directViolations}
        onHighlight={onHighlight}
      />
    );
  };

  const open = !!selectedGroup;

  return (
    <Modal show={open} onHide={onClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          Detected {count} violations from
          {' '}
          {label}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {modalContent()}
      </Modal.Body>
    </Modal>
  );
}

DirectViolationsModal.defaultProps = ({
  selectedGroup: undefined,
});
