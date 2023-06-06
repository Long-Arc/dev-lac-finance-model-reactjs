import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

export default class ActionRenderer extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }     
    }

    editRowData = () => {
        this.props.context.componentParent.editRowData(this.props.node.data);
    }

    deleteRowData = () => {
        this.props.context.componentParent.deleteRowData(this.props.node.data);
    }

    render() {
        return (
            <span>                
                <IconButton color="primary" onClick={this.editRowData} style={{ color: '#702492' }}>
                    <EditIcon />
                </IconButton>                    
                <IconButton color="secondary" onClick={this.deleteRowData} style={{ color: '#e64226' }}>
                    <DeleteIcon />
                </IconButton>
            </span>
        );
    }
}