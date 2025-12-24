import { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  ReactFlowProvider,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';

import TriggerNode from './nodes/TriggerNode';
import ConditionNode from './nodes/ConditionNode';
import DelayNode from './nodes/DelayNode';
import ActionNode from './nodes/ActionNode';

const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  delay: DelayNode,
  action: ActionNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 250, y: 50 },
    data: { label: 'Keyword Match', triggerType: 'keyword' },
  },
  {
    id: '2',
    type: 'action',
    position: { x: 250, y: 200 },
    data: { label: 'Send Welcome', actionType: 'send_message' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#10b981' } },
];

interface FlowCanvasProps {
  onNodeSelect: (node: Node | null) => void;
  onNodesChange: (nodes: Node[]) => void;
}

const FlowCanvas = ({ onNodeSelect, onNodesChange }: FlowCanvasProps) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      const edge = {
        ...params,
        animated: true,
        style: { stroke: '#10b981' },
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const data = event.dataTransfer.getData('application/reactflow');
      if (!data || !reactFlowInstance || !reactFlowWrapper.current) return;

      const nodeData = JSON.parse(data);
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode: Node = {
        id: `node_${Date.now()}`,
        type: nodeData.type,
        position,
        data: {
          label: nodeData.label,
          ...nodeData,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onNodeSelect(node);
    },
    [onNodeSelect]
  );

  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes) => {
          onNodesChangeInternal(changes);
          onNodesChange(nodes);
        }}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#10b981', strokeWidth: 2 },
        }}
      >
        <Controls className="!bg-card/80 !border-border/50 !rounded-lg [&>button]:!bg-card [&>button]:!border-border/50 [&>button]:!text-foreground [&>button:hover]:!bg-muted" />
        <MiniMap
          className="!bg-card/80 !border-border/50 !rounded-lg"
          nodeColor={(node) => {
            switch (node.type) {
              case 'trigger':
                return '#10b981';
              case 'condition':
                return '#f59e0b';
              case 'delay':
                return '#a855f7';
              case 'action':
                return '#3b82f6';
              default:
                return '#6b7280';
            }
          }}
        />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#374151" />
      </ReactFlow>
    </div>
  );
};

const FlowCanvasWrapper = (props: FlowCanvasProps) => (
  <ReactFlowProvider>
    <FlowCanvas {...props} />
  </ReactFlowProvider>
);

export default FlowCanvasWrapper;
