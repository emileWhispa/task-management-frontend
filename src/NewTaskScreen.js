import {Component} from "react";
import {Button, Form, Modal, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAdd, faFileUpload, faClose} from "@fortawesome/free-solid-svg-icons";
import NavigationBar from "./NavigationBar";
import {withRouter} from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";

Array.prototype.remove = function () {
    let what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

class NewTaskScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assignees: [],
            projects: [],
            selectedProjects: [],
            selectedAssignees: [],
            files:[],
            description:"",
            showProjectsModal: false,
            showAssigneesModal: false,
            loading:false,
            loggedIn: localStorage.getItem("user"),
            alertType: "error",
            alertTitle: "Error",
            alertContent: ""
        }
    }

    componentDidMount() {
        if(this.state.loggedIn) {
            this.fetchProjects();
        }else{
            this.props.history.push('/login');
        }
    }

    async fetchProjects() {
        let data = JSON.parse(localStorage.getItem("user")).data;
        let resp = await fetch("http://127.0.0.1:8080/api/tasks/get/values", {
            headers: {
                Authorization: "Bearer " + data.token
            }
        });
        if (resp.status === 200) {
            let data1 = (await resp.json()).data;
            this.setState({
                projects: data1.projects,
                assignees: data1.assignees,
            })
        } else if (resp.status === 401) {
            localStorage.removeItem("user");
            this.props.history.push('/login');
        }
    }

    handleClose() {
        this.props.history.goBack();
    }

    async submitForm(form) {

        if(this.state.description.length>100){
            return;
        }

        let user = JSON.parse(localStorage.getItem("user")).data;
        let data = new FormData(form)
        this.state.selectedAssignees.forEach(e=>{
            data.append("selected_assignees",e.id);
        })
        this.state.selectedProjects.forEach(e=>{
            data.append("selected_projects",e.id);
        })
        // data.append("selected_assignees",JSON.stringify(this.state.selectedAssignees.map(e=>e.id)));
        // data.append("selected_projects",JSON.stringify(this.state.selectedProjects.map(e=>e.id)));
        this.setState({
            loading: true
        });
        let res = await fetch('http://127.0.0.1:8080/api/tasks/action/create', {
            method: "POST",
            headers: {
                Authorization: "Bearer " + user.token
            },
            body: data
        });
        console.log(res);
        let json = await res.json();
        if (res.status === 200) {
            form.reset();
            this.setState({
                loading: false,
                alert: true,
                alertType: "success",
                alertTitle: "Success",
                selectedAssignees:[],
                selectedProjects:[],
                alertContent: json.message
            });
        } else {
            this.setState({
                loading: false,
                alert: true,
                alertType: "error",
                alertTitle: "Error",
                alertContent: json.message
            });

        }
    }

    closeAlert(){
        this.setState({
            alert: false
        });

        if(this.state.alertType === 'success'){
            this.handleClose();
        }
    }

    render() {
        return <div>
            <NavigationBar/>
            {
                this.state.alert && <SweetAlert
                    title={this.state.alertTitle}
                    type={this.state.alertType}
                    onConfirm={() => this.closeAlert()}
                    onCancel={() => this.closeAlert()}
                    // showCancel={true}
                    btnSize={'sm'}

                    confirmBtnText={'Close'}
                    confirmBtnCssClass={'btn btn-' + this.state.alertType + ' btn-sm'}
                    focusCancelBtn={true}
                >{this.state.alertContent}</SweetAlert>
            }
            <Modal show={this.state.showProjectsModal}>
                <Modal.Header closeButton onHide={() => this.setState({
                    showProjectsModal: false
                })}>
                    <Modal.Title style={{fontSize: 18}}>Select Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={'row'}>
                        {this.state.projects.map((e, index) => (<div key={index} className={'col-md-4'}><Form.Check
                            type={'checkbox'}
                            id={`project-check` + index}
                            style={{minHeight: 'auto', marginBottom: 0}}
                            checked={this.state.selectedProjects.filter(pro => pro.id === e.id).length > 0}
                            name={'priority'}
                            onChange={(ev) => {
                                if (ev.currentTarget.checked) {
                                    this.state.selectedProjects.push(e);
                                } else {
                                    this.state.selectedProjects.remove(e);
                                }
                                this.setState({});
                            }}
                            label={e.title}
                        /></div>))}
                    </div>
                </Modal.Body>
                <Modal.Footer className={'d-flex'}>
                    <div className={'flex-grow-1'}>

                    </div>
                    <div>
                        <Button variant="outline-primary" size={'sm'} onClick={() => this.setState({
                            showProjectsModal: false
                        })}>
                            Close
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
            <Modal show={this.state.showAssigneesModal}>
                <Modal.Header closeButton onHide={() => this.setState({
                    showAssigneesModal: false
                })}>
                    <Modal.Title style={{fontSize: 18}}>Select Assignee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={'row'}>
                        {this.state.assignees.map((e, index) => (<div className={'col-md-4'} key={index}><Form.Check
                            type={'checkbox'}
                            id={`project-check` + index}
                            style={{minHeight: 'auto', marginBottom: 0}}
                            checked={this.state.selectedAssignees.filter(pro => pro.id === e.id).length > 0}
                            name={'priority'}
                            onChange={(ev) => {
                                if (ev.currentTarget.checked) {
                                    this.state.selectedAssignees.push(e);
                                } else {
                                    this.state.selectedAssignees.remove(e);
                                }
                                this.setState({});
                            }}
                            label={e.name}
                        /></div>))}
                    </div>
                </Modal.Body>
                <Modal.Footer className={'d-flex'}>
                    <div className={'flex-grow-1'}>

                    </div>
                    <div>
                        <Button variant="outline-primary" size={'sm'} onClick={() => this.setState({
                            showAssigneesModal: false
                        })}>
                            Close
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>


            <Form onSubmit={(e)=>{
                e.preventDefault();
                this.submitForm(e.currentTarget);
            }} encType={'multipart/form-data'}>
                <Modal.Dialog className={'shadow-sm'}>
                    <Modal.Header closeButton onHide={() => this.handleClose()}>
                        <Modal.Title style={{fontSize: 18}}>Create Task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={'row'}>
                            <div className={'col-md-12'}>
                                <Form.Group className="mb-3" controlId="formBasicTaskName">
                                    <Form.Label className={'fw-bold text-muted'}>Name <span
                                        className={'text-danger'}>*</span></Form.Label>
                                    <Form.Control type="text" placeholder="Task Name" name={'taskName'}
                                                  required={'required'}/>
                                </Form.Group>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className={'col-md-6'}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label className={'fw-bold text-muted'}>Start Date <span
                                        className={'text-danger'}>*</span></Form.Label>
                                    <Form.Control type="date" name={'startDate'} required={'required'}/>
                                    <Form.Text className="text-muted">
                                        Add Time.
                                    </Form.Text>
                                </Form.Group>
                            </div>
                            <div className={'col-md-6'}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label className={'fw-bold text-muted'}>End Date <span
                                        className={'text-danger'}>*</span></Form.Label>
                                    <Form.Control type="date" name={'endDate'} required={'required'}/>
                                </Form.Group>
                            </div>
                        </div>

                        <div className={'row'}>
                            <div className={'col-md-12'}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label className={'fw-bold text-muted'}>Assignee <span
                                        className={'text-danger'}>*</span></Form.Label>
                                    <div>
                                        {!this.state.selectedAssignees.length ?
                                            <span className={'text-muted'}>Select Assignees</span> :
                                            this.state.selectedAssignees.map((e,index) => (
                                                <div key={index} className={'py-1 px-2 border rounded-3 me-1 mt-1 d-inline-flex'}
                                                     style={{fontSize: 12}}><span>{e.name}</span>
                                                    <button onClick={()=>{
                                                        this.state.selectedAssignees.remove(e);
                                                        this.setState({});
                                                    }} className={'badge bg-danger rounded-pill border-0 d-flex align-items-center justify-content-center ms-1'} style={{width:20,height:20}}>
                                                        <FontAwesomeIcon icon={faClose}/></button>
                                                </div>))}

                                        <button type={'button'} onClick={() => this.setState({
                                            showAssigneesModal: true
                                        })} className={'ms-3 border-0 bg-white'}><FontAwesomeIcon icon={faAdd}/></button>
                                    </div>
                                    <Form.Text className="text-muted mt-1">
                                        Add Collaborators
                                    </Form.Text>
                                </Form.Group>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className={'col-md-12'}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label className={'fw-bold text-muted'}>Projects <span
                                        className={'text-danger'}>*</span></Form.Label>
                                    <div className={'form-control d-flex align-items-center'}>
                                        <div className={'flex-grow-1'}>
                                            {!this.state.selectedProjects.length ?
                                                <span className={'text-muted'}>Project name</span> :
                                                this.state.selectedProjects.map((e,index) => (<span key={index}
                                                    className={'badge bg-success rounded-pill me-1'}>{e.title}</span>))}

                                        </div>
                                        <div>
                                            <button type={'button'} onClick={() => {
                                                this.setState({
                                                    showProjectsModal: true
                                                })
                                            }}
                                                    className={'bg-dark bg-opacity-10 py-1 px-2 rounded border-0 d-flex justify-content-center align-items-center'}>
                                                <FontAwesomeIcon
                                                    icon={faAdd}/> <span className={'ms-1'}>Add</span> <span
                                                className={'ms-1'}>Projects</span></button>
                                        </div>
                                    </div>
                                </Form.Group>
                            </div>
                        </div>

                        <div className={'row'}>
                            <div className={'col-md-12'}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label className={'fw-bold text-muted'}>Description <span
                                        className={'text-danger'}>*</span></Form.Label>
                                    <textarea className={'form-control '+(this.state.description.length>100?'border-danger':'')} placeholder="Add more details to this task"
                                              name={'description'}
                                              onKeyUp={(e)=>this.setState(
                                                  {
                                                      description:e.currentTarget.value
                                                  }
                                              )}
                                              required={'required'}/>
                                    <Form.Text className={"float-end "+(this.state.description.length>100?'text-danger':'text-muted')}>
                                        {this.state.description.length}/100
                                    </Form.Text>
                                </Form.Group>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className={'col-md-12'}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label className={'fw-bold text-muted'}>Priority <span
                                        className={'text-danger'}>*</span></Form.Label>
                                    <div className={'row'}>
                                        <div className={'col-md-3'}>
                                            <div className={'form-control form-control-sm'}>
                                                <Form.Check
                                                    type={'radio'}
                                                    id={`low-radio`}
                                                    name={'priority'}
                                                    required={'required'}
                                                    value={'Low'}
                                                    style={{minHeight: 'auto', marginBottom: 0}}
                                                    label={`Low`}
                                                />
                                            </div>
                                        </div>
                                        <div className={'col-md-3'}>
                                            <div className={'form-control form-control-sm'}>
                                                <Form.Check
                                                    type={'radio'}
                                                    id={`normal-radio`}
                                                    required={'required'}
                                                    value={'Normal'}
                                                    style={{minHeight: 'auto', marginBottom: 0}}
                                                    name={'priority'}
                                                    label={`Normal`}
                                                />
                                            </div>
                                        </div>
                                        <div className={'col-md-3'}>
                                            <div className={'form-control form-control-sm'}>
                                                <Form.Check
                                                    type={'radio'}
                                                    name={'priority'}
                                                    required={'required'}
                                                    value={'High'}
                                                    style={{minHeight: 'auto', marginBottom: 0}}
                                                    id={`high-radio`}
                                                    label={`High`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Form.Group>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className={'d-flex'}>
                        <div className={'flex-grow-1'}>
                            <input onChange={(e)=>{
                               if(e.currentTarget.files){
                                   this.setState({
                                       files:e.currentTarget.files
                                   })
                               }else{
                                   this.setState({
                                       files:[]
                                   })
                               }
                            } } type="file" style={{display:'none'}} id={'file'} name={'files_attachments'} multiple/>
                            <Button variant="link" size={'sm'} style={{textDecoration: 'none'}}
                                    onClick={()=>{
                                        document.getElementById("file").click();
                                    }}>
                                <FontAwesomeIcon icon={faFileUpload}/> Attach {this.state.files.length? <span>({this.state.files.length})</span> : ''}
                            </Button>
                        </div>
                        <div>
                            <Button type={'button'} variant="outline-primary" size={'sm'} onClick={() => this.handleClose()}>
                                Cancel
                            </Button>
                            {this.state.loading ? <div className={'ms-1'}>
                                <Spinner animation="border" size={'sm'}/>
                            </div> :<Button type={"submit"} variant="secondary" size={'sm'} className={'ms-1'}>
                                Submit
                            </Button>}
                        </div>
                    </Modal.Footer>
                </Modal.Dialog>
            </Form>
        </div>;
    }
}

export default withRouter(NewTaskScreen);