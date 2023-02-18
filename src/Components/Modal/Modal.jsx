import React, { Component } from 'react'
import "./Modal.scss"

export class Modal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { action, children } = this.props;
        
      
    return (
      <>
        <section id="modal">
            <div className="modal-wrapper">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="card">
                                <div className="card-header">
                                    <div className="card-title d-flex justify-content-between align-items-center mb-0">
                                        <h2 className='mb-0'>Modal</h2>
                                        <button className="btn btn-close" onClick={action}></button>
                                    </div>
                                </div>
                                <div className="card-body">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      </>
    )
  }
}

export default Modal