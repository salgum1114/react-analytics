import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';

import Panel from './Panel';
import { Resizer } from '../resizer';

const columns = [
    { key: "id", name: "ID", editable: true },
    { key: "title", name: "Title", editable: true },
    { key: "complete", name: "Complete", editable: true }
];
  
const rows = [
    { id: 0, title: "Task 1", complete: 20 },
    { id: 1, title: "Task 2", complete: 40 },
    { id: 2, title: "Task 3", complete: 60 }
];

class DataGridPanel extends Component {
    render() {
        return (
            <Panel>
                <Resizer>
                    {(width, height) => (
                        <ReactDataGrid
                            minHeight={height}
                            minWidth={width}
                            columns={columns}
                            rowGetter={i => rows[i]}
                            rowsCount={3}
                        />
                    )}
                </Resizer>
            </Panel>
        );
    }
}

export default DataGridPanel;
