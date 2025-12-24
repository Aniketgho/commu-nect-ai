import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Node } from 'reactflow';
import { ArrowLeft, Save, Play, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import FlowSidebar from '@/components/flow-builder/FlowSidebar';
import FlowCanvas from '@/components/flow-builder/FlowCanvas';
import NodeConfigPanel from '@/components/flow-builder/NodeConfigPanel';
import { toast } from 'sonner';

const FlowBuilder = () => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [flowName, setFlowName] = useState('Welcome Flow');
  const [nodes, setNodes] = useState<Node[]>([]);

  const handleNodeSelect = useCallback((node: Node | null) => {
    setSelectedNode(node);
  }, []);

  const handleNodeUpdate = useCallback((nodeId: string, data: Record<string, any>) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, data } : node
      )
    );
    setSelectedNode((prev) => (prev?.id === nodeId ? { ...prev, data } : prev));
  }, []);

  const handleSave = () => {
    toast.success('Flow saved successfully!');
  };

  const handleTest = () => {
    toast.info('Starting flow test...');
  };

  return (
    <>
      <Helmet>
        <title>Flow Builder - WhatsApp Automation | WazzApp</title>
        <meta
          name="description"
          content="Build powerful WhatsApp automation flows with our visual drag-and-drop builder"
        />
      </Helmet>

      <div className="h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="h-14 border-b border-border/50 bg-card/50 backdrop-blur-sm flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="h-6 w-px bg-border/50" />
            <Input
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              className="w-64 bg-transparent border-none focus-visible:ring-0 text-lg font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleTest}>
              <Play className="w-4 h-4 mr-2" />
              Test Flow
            </Button>
            <Button variant="gradient" size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Duplicate Flow</DropdownMenuItem>
                <DropdownMenuItem>Export as JSON</DropdownMenuItem>
                <DropdownMenuItem>View History</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete Flow</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          <FlowSidebar />
          <FlowCanvas onNodeSelect={handleNodeSelect} onNodesChange={setNodes} />
          {selectedNode && (
            <NodeConfigPanel
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
              onUpdate={handleNodeUpdate}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default FlowBuilder;
