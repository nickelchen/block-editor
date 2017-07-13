'use strict';

import React, {PropTypes} from 'react';

let DropTarget = require('react-dnd').DropTarget;
let DragSource = require('react-dnd').DragSource;

const cardSource = {
    beginDrag(props) {
        return { uniqId: props.uniqId };
    }
};

const cardTarget = {
    hover(props, monitor) {
        const draggedId = monitor.getItem().uniqId;
        if (draggedId !== props.uniqId && !monitor.isOver({ shallow: true })) {
            props.onReorder(draggedId, props.uniqId);
        }
    }
};

const ItemType = 'elem';

const dropWrapper = DropTarget(ItemType, cardTarget, (connect) => {
    return {
        connectDropTarget: connect.dropTarget()
    };
});

const dragWrapper = DragSource(ItemType, cardSource, (connect, monitor) =>{
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
    };
});

export default {
    propTypes: {
        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired
    },
    dragWrapper: dragWrapper,
    dropWrapper: dropWrapper,
    compWrapper (self, comp) {
        return self.props.connectDropTarget(self.props.connectDragPreview(comp));
    }
};
