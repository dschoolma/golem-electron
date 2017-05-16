import React from 'react';

export default class Modal extends React.Component {


    constructor(props) {
        super(props);
    }

    _handleCancel() {
        this.props.closeModal()
    }

    _handleDelete() {
        const {deleteCallback, deleteId} = this.props
        deleteCallback(deleteId)
        this.props.closeModal()
    }

    render() {
        const {type} = this.props
        return (
            <div className="container__modal">
                <div className="content__modal">
                    <div>
                        <span className="icon-warning"/>
                    </div>
                    <span>Are you sure  you want to delete this task? You can’t undo this.</span>
                    <div className="action__modal">
                        <span className="btn--cancel" onClick={::this._handleCancel}>Cancel</span>
                        <button className="btn--warning" onClick={::this._handleDelete}>Delete</button>
                    </div>
                </div>
            </div>
        );
    }
}