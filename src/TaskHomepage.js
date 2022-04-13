import {Component} from "react";
import {withRouter} from "react-router-dom";
import NavigationBar from "./NavigationBar";
import {Button, Card, Container, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAdd} from '@fortawesome/free-solid-svg-icons'
import moment from "moment";

class TaskHomepage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: localStorage.getItem("user"),
            tasks: [],
            showModal: false
        }
    }

    componentDidMount() {
        //Check if user exists in local storage
        if(this.state.loggedIn) {
            this.fetchTasks();
        }else{
            this.props.history.push('/login');
        }
    }

    async fetchTasks() {
        let data = JSON.parse(localStorage.getItem("user")).data;
        let resp = await fetch("http://172.16.40.10:8080/api/tasks/view/tasks", {
            headers: {
                Authorization: "Bearer " + data.token
            }
        });
        if (resp.status === 200) {
            let data1 = (await resp.json()).data;
            this.setState({
                tasks: data1,
            })
        } else if (resp.status === 401) {
            //Force user to re-login after unauthorized response from the server
            localStorage.removeItem("user");
            this.props.history.push('/login');
        }
    }

    handleClose() {
        this.setState({
            showModal: false
        })
    }

    render() {
        return <div className={'App'}>
            <NavigationBar/>
            {this.state.loggedIn ? <Container style={{textAlign: 'left'}} className={'p-3'}>
                <Card className={'p-3 shadow-sm'}>
                    <div className={'d-flex'}>
                        <div className={'flex-grow-1'}>
                            <h3 className={'m-0'}>Available Tasks</h3>
                            <p className={'text-muted'}>View created tasks</p>
                        </div>
                        <div>
                            <Button onClick={() => {
                                this.props.history.push('/new/task')
                            }} value={"New Task"}><FontAwesomeIcon icon={faAdd}/> New Task</Button>
                        </div>
                    </div>
                    <table className={'table table-striped mt-2'}>
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Task Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th style={{width:'40%'}}>Description</th>
                            <th>Priority</th>
                            <th/>
                        </tr>
                        </thead>
                        <tbody className={'border-top-0'}>
                        {!this.state.tasks.length ? <tr>
                            <td colSpan={7} className={'text-center'}>No Records found !</td>
                        </tr> : this.state.tasks.map((e,index) => (<tr key={index}>
                            <td>{e.id}</td>
                            <td>{e.taskName}</td>
                            <td>{moment(e.startDate).format("YYYY-MM-DD")}</td>
                            <td>{moment(e.endDate).format("YYYY-MM-DD")}</td>
                            <td>{e.description}</td>
                            <td>{e.priority}</td>
                            <td>
                                <a onClick={(ev) => {
                                ev.preventDefault();
                                this.props.history.push('task/details', {data: e});
                            }} href="#" className={'btn btn-primary btn-sm'}>Details</a></td>
                        </tr>))}
                        </tbody>
                    </table>
                </Card>
            </Container> : <div style={{padding: '50px'}}><Spinner animation="border"/></div>}
        </div>;
    }
}


export default withRouter(TaskHomepage);