import React, {useState} from "react";
import ReactFlow, {Connection, Edge, Elements, isNode, Position} from 'react-flow-renderer';
import {Adventure, AdventureState} from "./epicTestsForm";
import {Theme, makeStyles, TextField} from '@material-ui/core';
import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const useStyles = makeStyles(({}: Theme) => ({
  container: {
    height: '620px',
    display: 'flex',
    flexDirection: 'row',
  },
  stateName: {
    fontWeight: 'bold',
    fontStyle: 'italic'
  },
  elementEditor: {

  }
}));

interface EpicAdventureTestEditorProps {
  adventure?: Adventure;
  onUpdate: (adventure?: Adventure) => void;
}

interface SelectedEdge {
  type: 'EDGE',
  sourceName: string,
  targetName: string,
  text: string,
}
interface SelectedNode {
  type: 'NODE',
  state: AdventureState,
}
type SelectedElement = SelectedNode | SelectedEdge;

const EpicAdventureTestEditor: React.FC<EpicAdventureTestEditorProps> = ({
  adventure,
  onUpdate
}) => {
  const classes = useStyles();
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);

  const buildFlowElements = (adventure: Adventure): Elements => {
    const elements: Elements = [];
    Object.entries(adventure).map(([name, state]) => {
      elements.push({
        id: name,
        data: {
          label:
            <div>
              <div className={classes.stateName}>{name}</div>
              <div>{state.paragraphs[0].substr(0, 20)}...</div>
            </div>,
        },
        position: { x: 10, y: 10 }
      });

      state.options.forEach((option, idx) => {
        console.log('creating edge for', option.text)
        elements.push({
          id: `${name}--${idx}--${option.targetName}`,
          source: name,
          target: option.targetName,
          label: option.text
        })
      })
    });
    return elements;
  };

  const addLayout = (elements: Elements): Elements => {
    const nodeWidth = 172;
    const nodeHeight = 36;

    dagreGraph.setGraph({ rankdir: 'TB', ranksep: 100 });

    elements.forEach((el) => {
      if (isNode(el)) {
        dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
      } else {
        dagreGraph.setEdge(el.source, el.target);
      }
    });

    dagre.layout(dagreGraph);

    return elements.map((el) => {
      if (isNode(el)) {
        const nodeWithPosition = dagreGraph.node(el.id);
        el.targetPosition = Position.Top;
        el.sourcePosition = Position.Bottom;

        el.position = {
          x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
          y: nodeWithPosition.y - nodeHeight / 2,
        };
      }

      return el;
    });
  };

  if (adventure) {
    const elements = addLayout(buildFlowElements(adventure));

    const onConnect = (connection: Edge | Connection): void => {
      console.log('connection', connection.source, connection.target)
      if (connection.source && connection.target && adventure[connection.source]) {
        adventure[connection.source] = {
          ...adventure[connection.source],
          options: adventure[connection.source].options.concat([{
            text: 'new',
            targetName: connection.target,
          }])
        };
        console.log(adventure[connection.source])
        onUpdate(adventure);
      }
    };

    const onElementsRemove = (elements: Elements): void => {
      console.log('removing', elements)
      elements.forEach(element => {
        if (isNode(element)) {
          if (adventure[element.id]) {
            // delete the node
            console.log('deleting node', element.id)
            delete adventure[element.id];
            // delete all references to the node
            Object.entries(adventure).forEach(([name, state]) => {
              adventure[name] = {
                ...state,
                options: state.options.filter(option => option.targetName !== element.id),
              }
            })
          } else {
            console.log(`deleted node doesn't exist!`)
          }
        } else {
          // delete the edge
          const [sourceName, idx, targetName] = element.id.split('--');
          if (sourceName && idx && targetName) {
            console.log('deleting edge from source', sourceName);
            if (adventure[sourceName]) {
              adventure[sourceName] = {
                ...adventure[sourceName],
                options: adventure[sourceName].options.filter(option => option.targetName !== targetName),
              }
            } else {
              console.log('cannot find source node', sourceName)
            }
          }
        }
      });
      onUpdate(adventure);
    };

    const onSelectionChange = (elements: Elements | null): void => {
      console.log('selected',elements)
      if (elements && elements[0]) {
        if (isNode(elements[0])) {
          setSelectedElement({
            type: 'NODE',
            state: adventure[elements[0].id]
          });
        } else {
          const edge = elements[0];
          setSelectedElement({
            type: 'EDGE',
            sourceName: edge.source,
            targetName: edge.target,
            text: adventure[edge.source].options.find(option => option.targetName === edge.target)?.text || ''
          })
        }
      }
    };

    const elementEditor = (element: SelectedElement) => {
      if (element.type === 'NODE') {
        return (
          <div>
            <h3>Node:</h3>
            <TextField
              value={element.state.name}
              label="Name"
              fullWidth
            />
            <TextField
              value={element.state.paragraphs}
              label="Text"
              rows={10}
              multiline
              fullWidth
            />
          </div>
        )
      } else {
        return (
          <div>
            <h3>Edge from {element.sourceName} to {element.targetName}:</h3>
            <TextField
              value={element.text}
              label="Text"
              fullWidth
            />
          </div>
        )
      }
    };

    return (
      <div className={classes.container}>
        <ReactFlow
          elements={elements}
          onConnect={onConnect}
          onElementsRemove={onElementsRemove}
          onSelectionChange={onSelectionChange}
          deleteKeyCode={46}
        />
        { selectedElement && elementEditor(selectedElement) }
      </div>
    )
  }

  return null;
};

export default EpicAdventureTestEditor;
