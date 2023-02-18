import axios from 'axios';
import React, { Component } from 'react'
import { toast } from 'react-toastify';
import Modal from '../../Components/Modal/Modal';
import "./Home.scss"

export class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // input data for the form
            input: { 
                task : "",
                status: "pending"
            },
            modal:{
                status: false // modal status
            },
            tasks: [] // data of tasks
        }
    }

    // get all data from the database API
    componentDidMount () {
        axios.get(`http://localhost:5050/tasks?_sort=id&_order=desc`).then(res => {
            this.setState((prevState) => ({
                ...prevState,
                tasks: res.data
            }))
        })
    }
    
    // form data set to input state
    handleInputOnchange = (e) => {
        this.setState((prevState) => ({
            ...prevState,
            input: {
                ...prevState.input,
                [e.target.name]: e.target.value
            }
        }))
    }
    
    // submit form data to the database API
    handleFormSubmit = (e) => {
        e.preventDefault();
        
        if(!this.state.input.task){  // if the field is empty
            toast.error("Please fill the field");
        }
        else{ // if the field is not empty

            toast.success("Task added successfully");
            axios.post(`http://localhost:5050/tasks`, {
                subject: this.state.input.task,
                status: this.state.input.status
            }).then(res => {
                // set the tasks state value with new data & sort the data by id with descending order
                this.setState((prevState) => ({
                    ...prevState,
                    tasks: [...prevState.tasks, res.data].sort((a, b) => b.id - a.id) 
                }))

                // clear the input field and states 
                this.setState((prevState) => ({
                    ...prevState,
                    input: {
                        ...prevState.input,
                        task: ""
                    },
                    modal:{
                        status: false
                    }
                }))
            })            
        }

    }
  render() {

    // handle for modal status
    const handleModal = () => {
        this.setState((prevState) => ({
            ...prevState,
            modal:{
                ...prevState.modal,
                status:  !modal.status? true : false,
            }
        }))
    }
    
    // handle for task complete
    const handleTaskComplete = (id) => {
        axios.patch(`http://localhost:5050/tasks/${id}`, {
            status: "completed"
        }).then((res) => {
            this.setState((prevState) => ({
                ...prevState,
                tasks: [...prevState.tasks.filter(task => task.id!== id), res.data].sort((a, b) => b.id - a.id)
            }))
        })
    }
    // handle for task cancel
    const handleTaskCancel = (id) => {
        axios.patch(`http://localhost:5050/tasks/${id}`, {
            status: "canceled"
        }).then((res) => {
            this.setState((prevState) => ({
                ...prevState,
                tasks: [...prevState.tasks.filter(task => task.id!== id), res.data].sort((a, b) => b.id - a.id)
            }))
        })
    }
    // handle for task pending
    const handleTaskPending = (id) => {
        axios.patch(`http://localhost:5050/tasks/${id}`, {
            status: "pending"
        }).then((res) => {
            this.setState((prevState) => ({
                ...prevState,
                tasks: [...prevState.tasks.filter(task => task.id !== id), res.data].sort((a, b) => b.id - a.id)
            }))
        })
    }

    // get value from state
    const { input, modal, tasks } = this.state;

    // function for task showing loops
    const tasksShow = (status) => {
        return tasks.filter(data => data.status === status)
    }


    return (
      <>
        <div className="container my-5">
            <div className="row">
                <div className="col">
                    <button className="btn btn-primary" onClick={handleModal}>Add Your To Do </button>
                </div>
            </div>
        </div>
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title text-center">To Do App</h5>
                            <hr />
                            <div className="row">
                                <div className="col-md-4">
                                <h4 className="text-center mb-3">Pending</h4>
                                {/* Pending Tasks Show */}
                                    {!tasksShow("pending") || tasksShow("pending").length === 0 ? (
                                        // if there is no pending task show the message
                                        <div className='noData mb-3'><p>No Data Found</p></div>
                                        ) : (
                                        // if there is pending task show the tasks
                                        tasks.map((task, index) => {
                                            if(task.status === "pending"){
                                                return(
                                                    <div className="pending mb-3" key={index}>
                                                    <div className="todo_list align-items-center d-flex justify-content-between">
                                                        <div className="todo_title">
                                                            <span>{task.subject}</span>
                                                        </div>
                                                        <div className="actions">
                                                            <button className="btn btn-success btn-sm" onClick={() => handleTaskComplete(task.id)}>Complete</button> &nbsp;
                                                            <button className="btn btn-danger btn-sm" onClick={() => handleTaskCancel(task.id)}>Cancel</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                )
                                            }
                                        })
                                    )}
                                </div>
                                <div className="col-md-4">
                                    <h4 className="text-center mb-3">Completed</h4>
                                    {/* Complete Task Show */}
                                    {!tasksShow("completed") || tasksShow("completed").length === 0 ? (
                                        // if there is no complete task show the message
                                        <div className='noData mb-3'><p>No Data Found</p></div>
                                    ) : (
                                         // if there is complete task show the task
                                        tasks.map((task, index) => {
                                            if(task.status === "completed"){
                                                return(
                                                    <div className="completed mb-3" key={index}>
                                                    <div className="todo_list align-items-center d-flex justify-content-between">
                                                        <div className="todo_title">
                                                            <span>{task.subject}</span>
                                                        </div>
                                                        <div className="actions">
                                                            <button className="btn btn-warning btn-sm" onClick={() => handleTaskPending(task.id)}>Pending</button> &nbsp;
                                                            <button className="btn btn-danger btn-sm" onClick={() => handleTaskCancel(task.id)}>Cancel</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                )
                                            }
                                        })
                                    )}
                                </div>
                                <div className="col-md-4">
                                <h4 className="text-center mb-3">Canceled</h4>
                                    {/*  Cancel Task Show */}
                                    {!tasksShow("canceled") || tasksShow("canceled").length === 0 ? (
                                        // if there is no cancel task show the message
                                        <div className='noData mb-3'><p>No Data Found</p></div>
                                        ) : (
                                            // if there is cancel task show the task 
                                        tasks.map((task, index) => {
                                            if(task.status === "canceled"){
                                                return(
                                                    <div className="canceled mb-3" key={index}>
                                                    <div className="todo_list align-items-center d-flex justify-content-between">
                                                        <div className="todo_title">
                                                            <span>{task.subject}</span>
                                                        </div>
                                                        <div className="actions">
                                                            <button className="btn btn-warning btn-sm" onClick={() => handleTaskPending(task.id)}>Pending</button> &nbsp;
                                                            <button className="btn btn-success btn-sm" onClick={() => handleTaskComplete(task.id)}>Complete</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                )
                                            }
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Modal with children */}
        {modal.status && <Modal action={handleModal}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col">
                        <form>
                            <div className="my-3">
                                <label>Task</label>
                                <input type="text" className='form-control mt-2' placeholder="Your Task" name="task" onChange={this.handleInputOnchange} value={input.task} />
                            </div>
                            <div className="my-3">
                                <button onClick={this.handleFormSubmit} className="btn btn-success w-100">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>}


      </>
    )
  }
}

export default Home