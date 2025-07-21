import { useContext, useEffect, useMemo, useState } from 'react';
import { ViolationsContext, VisualizationHistory, GraphSettingsContext, GraphContext, LayerContext } from '../../../context';
import ViolationsGroup from './group';
import { ExtendedSimpleEdgeData, NodeData } from '../../../api';
import ViolationsList from './ViolationList';
import { VisibilityOptions } from '../../../helpers/enums';
import DirectViolationsModal from './DirectViolationsModal';

export default function DirectViolations() {
  const { violations, visibility, setVisibility } = useContext(ViolationsContext);
  const { settings } = useContext(GraphSettingsContext);
  const { getParents } = useContext(GraphContext);
  const { layerDepth } = settings;
  const { layers } = useContext(LayerContext);
  const { directViolations } = violations;
  const { currentNodeDepth, currentNode } = useContext(VisualizationHistory);

  // Store parents for each nodeId: nodeId -> NodeData[]
  const [nodeParents, setNodeParents] = useState<Record<string, NodeData[]>>({});

  // Update nodeParents whenever violations change
  useEffect(() => {
    const parentsMap: Record<string, NodeData[]> = {};

    directViolations.forEach((violation) => {
      const sourceNode = violation.sourceNode;
      const targetNode = violation.targetNode;

      if (sourceNode && !parentsMap[sourceNode.id]) {
        parentsMap[sourceNode.id] = getParents(sourceNode);
      }
      if (targetNode && !parentsMap[targetNode.id]) {
        parentsMap[targetNode.id] = getParents(targetNode);
      }
    });

    setNodeParents(parentsMap);
  }, [directViolations]);

  const showViolations = (newVal: VisibilityOptions) => {
    setVisibility({
      ...visibility,
      directViolations: newVal,
    });
  };

  const liftingIndex = (layers.length - currentNodeDepth) - (layerDepth + 1);

  const directViolationGroups = useMemo(() =>
    directViolations.reduce((g: ViolationsGroup<ExtendedSimpleEdgeData>[], l) => {
      const index = g.findIndex((c2) => c2.label === l.sourceNode?.label);
      if (index >= 0) {
        g[index].items.push(l);
      } else {
        g.push({
          items: [l],
          label: l.sourceNode?.label || '',
        });
      }
      return g;
    }, []), [liftingIndex, directViolations, layerDepth, currentNode, currentNodeDepth]
  );

  // Memoize liftedDirectViolations so it only recalculates when liftingIndex or dependencies change
  const liftedDirectViolations = useMemo(() => {
    if (liftingIndex <= 0) return directViolationGroups;

    return directViolations.reduce((groups: ViolationsGroup<ExtendedSimpleEdgeData>[], violation) => {
      const sourceNode = violation.sourceNode;
      const targetNode = violation.targetNode;

      if (!sourceNode || !targetNode) return groups;

      const sourceParents = nodeParents[sourceNode.id] || [];
      const targetParents = nodeParents[targetNode.id] || [];

      // Use the parent at liftingIndex if available, otherwise skip
      const liftedSource = sourceParents[liftingIndex];
      const liftedTarget = targetParents[liftingIndex];

      if (!liftedSource || !liftedTarget) return groups;

      // Create a new edge between the lifted ancestors
      const liftedEdge: ExtendedSimpleEdgeData = {
        ...violation,
        source: liftedSource.id,
        target: liftedTarget.id,
        sourceNode: liftedSource,
        targetNode: liftedTarget,
      };

      // Group by the label of the lifted source node
      const groupLabel = liftedSource.label || '';
      const groupIndex = groups.findIndex((g) => g.label === groupLabel);

      if (groupIndex >= 0) {
        groups[groupIndex].items.push(liftedEdge);
      } else {
        groups.push({
          items: [liftedEdge],
          label: groupLabel,
        });
      }
      return groups;
    }, []);
  }, [liftingIndex, directViolations, layerDepth, currentNode, currentNodeDepth]);

  const sortedDirectViolationGroups = useMemo(() => {
    // Calculate average number of items per group
    const totalItems = liftedDirectViolations.reduce((sum, group) => sum + group.items.length, 0);
    const avg = liftedDirectViolations.length > 0 ? totalItems / liftedDirectViolations.length : 0;

    return liftedDirectViolations
      .map(group => {
        let priority = '';
        if (group.items.length > avg) {
          priority = 'High Priority';
        } else if (group.items.length === avg) {
          priority = 'Medium Priority';
        } else {
          priority = 'Low Priority';
        }
        return {
          ...group,
          label: `${group.label} (${priority})`,
        };
      })
      .sort((a, b) => b.items.length - a.items.length);
  }, [liftedDirectViolations]);

  return (
    <ViolationsList
      checkboxId="direct-violations-checkbox"
      groups={sortedDirectViolationGroups}
      header="Reference Architecture violations"
      Modal={DirectViolationsModal}
      showInVisualization={visibility.directViolations}
      setShowInVisualization={showViolations}
    />
  );
}