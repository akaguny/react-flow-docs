---
title: Custom Nodes
sidebar_position: 3
---

If you want to add new node types, you need to pass a `nodeTypes` object to the `ReactFlow` component:

```jsx
function Flow({ nodes, edges }) {
  const nodeTypes = useMemo(() => ({ special: CustomNodeComponent }), []);

  return <ReactFlow nodeTypes={nodeTypes} nodes={nodes} edges={edges} />;
}
```

You can now use the type `special` for a node.
The `default`, `input`, `output` and `group` types would still be available, except you overwrote one of them.
There is a more advanced example of a custom node implementation in the [custom node example](/docs/examples/nodes/custom-node).

:::info

You can find detailed information on how to implement and use a custom node in the [custom nodes guide](/docs/guides/custom-nodes)

:::

### Passed Prop Types

Your custom nodes are wrapped so that the basic functions like dragging or selecting work. Custom nodes receive the following props:

- `id`: string
- `data`: object
- `type`: string
- `xPos`: number
- `yPos`: number
- `zIndex`: number
- `selected`: boolean
- `sourcePosition`: string
- `targetPosition`: string
- `dragging`: boolean
- `isConnectable`: boolean
- `dragHandle`: string

### Dimensions and other values from a node

If you need the width and height for example, you can use the `useStore` function to access other node attributes:

```js
const size = useStore((s) => {
  const node = s.nodeInternals.get(id);

  return {
    width: node.width,
    height: node.height,
  };
});
```

This would re-render the custom node if the width or height change.

### Styling

When you create a new node type you also need to implement some styling. Your custom node has no default styles.

### Prevent dragging & selecting

If you have controls (like a slider) or other elements inside your custom node that should not drag the node you can add the class name `nodrag`. This also prevents the selection of a node.

### Allow scrolling inside a node

If you want to allow scrolling inside a node or inside an element of a node you can add the class name `nowheel` to the node or the element.

### Helpers

React Flow comes with some helpers to give your custom nodes super powers:

- [Node Resizer](/docs/api/nodes/node-resizer/): Component for adding a resize UI
- [Node Toolbar](/docs/api/edges/base-edge/): Toolbar or tooltip component
- [useNodeId](/docs/api/hooks/use-node-id/): hook for accessing the node id within a custom node
