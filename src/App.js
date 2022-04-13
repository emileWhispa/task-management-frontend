import './App.css';
import {Component} from "react";
import {Button, Card, Form, Spinner} from "react-bootstrap";
import {withRouter} from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";

class App extends Component{

  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      alert: false,
      alertType: "error",
      alertTitle: "Error",
      alertContent: ""
    }
  }

  goToHomePage(){
    this.props.history.push('/home')
  }

  //Handle Login Process
  async loginAction(form) {
    this.setState({
      loading: true
    });

    let data = new FormData(form);
    let res = await fetch('http://172.16.40.10:8080/api/auth/sign-in', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: data.get("username"),
        password: data.get("password")
      })
    });

    let json = await res.json();
    if (res.status === 200) {
      form.reset();
      localStorage.setItem("user", JSON.stringify(json))
      this.goToHomePage();
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

  render(){
    return (
        <div className="App">
          {
            this.state.alert && <SweetAlert
                title={this.state.alertTitle}
                type={this.state.alertType}
                onConfirm={()=>this.setState({
                  alert:false
                })}
                onCancel={()=>this.setState({
                  alert:false
                })}
                // showCancel={true}
                btnSize={'sm'}

                confirmBtnText={'Close'}
                confirmBtnCssClass={'btn btn-'+this.state.alertType+' btn-sm'}
                focusCancelBtn={true}
            >{this.state.alertContent}</SweetAlert>
          }
          <div className={'row align-items-center justify-content-center'}>
            <div className={'col-md-4'}>
              <Card className={'p-3 mt-5 shadow-sm'}>
                <Form style={{textAlign:"left"}} onSubmit={(e)=>{
                  e.preventDefault();
                  this.loginAction(e.currentTarget);
                }}>
                  <h1>Administrator Login</h1>
                  <h6 className={'text-muted'}>Enter your sign in credentials</h6>
                  <Form.Group className="mb-3 mt-5" controlId="formBasicEmail">
                    <Form.Label>Username <span className={'text-danger'}>*</span></Form.Label>
                    <Form.Control type="text" placeholder="Enter username" name={'username'} required={'required'}/>
                    <Form.Text className="text-muted">
                      Username is required.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password <span className={'text-danger'}>*</span></Form.Label>
                    <Form.Control type="password" placeholder="Password" name={'password'} required={'required'}/>
                    <Form.Text className="text-muted">
                      Password is required.
                    </Form.Text>
                  </Form.Group>
                  <div className={'clearfix mt-5'}>
                    <div className={'float-end'}>{this.state.loading ? <Spinner animation="border" /> : <Button variant="primary" type="submit" className={'mt-2'}>
                      Sign In
                    </Button>}</div>
                  </div>

                </Form>
              </Card>
            </div>
          </div>
        </div>
    );
  }
}

export default withRouter(App);
