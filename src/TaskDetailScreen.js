import {Component} from "react";
import {withRouter} from "react-router-dom";
import NavigationBar from "./NavigationBar";
import {Container} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";

class TaskDetailScreen extends Component{
    render() {
        return <div className={'App'}>
            <NavigationBar/>
            <Container style={{textAlign:'left'}}>
                <div className={'row justify-content-center p-5'}>
                    <div className={'col-md-8'}>
                        <div className={'row'}>
                            <div className={'col-md-6 mb-3'}>
                                <span className={'fw-bold'}>Task Name</span>
                                <div>{this.props.history.location.state.data.taskName}</div>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className={'col-md-6 mb-3'}>
                                <span className={'fw-bold'}>Start Date</span>
                                <div>{this.props.history.location.state.data.startDate}</div>
                            </div>
                            <div className={'col-md-6'}>
                                <span className={'fw-bold'}>End Date</span>
                                <div>{this.props.history.location.state.data.endDate}</div>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className={'col-md-6 mb-3'}>
                                <span className={'fw-bold'}>Priority</span>
                                <div>{this.props.history.location.state.data.priority}</div>
                            </div>
                            <div className={'col-md-6'}>
                                <span className={'fw-bold'}>Description</span>
                                <div>{this.props.history.location.state.data.description}</div>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className={'col-md-6 mb-3'}>
                                <span className={'fw-bold'}>Assignees</span>
                                <div>{this.props.history.location.state.data.assignees.map((e,index) => (
                                    <div key={index} className={'py-1 px-2 border rounded-3 me-1 mt-1 d-inline-flex'}
                                    style={{fontSize: 12}}><span>{e.name}</span>
                                    </div>))}</div>
                            </div>
                            <div className={'col-md-6'}>
                                <span className={'fw-bold'}>Projects</span>
                                <div>{this.props.history.location.state.data.projects.map((e,index) => (
                                    <div key={index} className={'py-1 px-2 border rounded-3 me-1 mt-1 d-inline-flex'}
                                         style={{fontSize: 12}}><span>{e.title}</span>
                                    </div>))}</div>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className={'col-md-6 mb-3'}>
                                <span className={'fw-bold'}>Attachments</span>
                                <div>{this.props.history.location.state.data.attachments.map((e,index) => (
                                    <button onClick={event => {
                                        event.preventDefault();
                                        window.location.href = 'http://127.0.0.1:8080/api/download/attachment/'+e.id;
                                    }} key={index} className={'py-1 px-2 border rounded-3 me-1 mt-1 d-inline-flex'}
                                    style={{fontSize: 12}}><FontAwesomeIcon icon={faDownload}/> <span className={'ms-1'}>Download</span>
                                    </button>))}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>;
    }
}


export default withRouter(TaskDetailScreen);