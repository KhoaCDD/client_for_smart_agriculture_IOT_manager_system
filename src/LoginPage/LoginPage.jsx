import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { userActions } from '../_actions';
import './login.css';
class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        // reset login status
        this.props.dispatch(userActions.logout());

        this.state = {
            username: '',
            password: '',
            submitted: false,
            signIn: '',
            signUp: '',
            //State sign up
            user: {
                username: '',
                email: '',
                password: ''
            },
            submittedSignUp: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSwitch =this.handleSwitch.bind(this);

        this.handleChangeSignUp =this.handleChangeSignUp.bind(this);
        this.handleSubmitSignUp =this.handleSubmitSignUp.bind(this);
    }
    /**
     * Sign Up Func
     */
    handleChangeSignUp(event) {
        const { name, value } = event.target;
        const { user } = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }

    handleSubmitSignUp(event) {
        event.preventDefault();

        this.setState({ submittedSignUp: true });
        const { user } = this.state;
        const { dispatch } = this.props;
        if (user.email && user.username && user.password) {
            dispatch(userActions.register(user));
        }
    }
     /**
      * Sign In Func
      */
    handleSwitch(){
        if(this.state.signUp ==="right-panel-active"){
            this.setState(state => {
                return {
                    ...state,
                    signUp: '',
                    signIn: 'right-panel-active'
                }
            });
        }
        else{
            this.setState(state => {
                return {
                    ...state,
                    signIn: '',
                    signUp: 'right-panel-active'
                }
            });
        }
        
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { username, password } = this.state;
        const { dispatch } = this.props;
        if (username && password) {
            dispatch(userActions.login(username, password));
        }
    }

    render() {
        const { loggingIn } = this.props;
        const { username, password, submitted } = this.state;
        
        const { registering  } = this.props;
        const { user, submittedSignUp } = this.state;
        return (
            <div>
                <h2></h2>
                <div className={"container "+this.state.signUp} id="container">
                    <div className={"form-container sign-up-container "+this.state.signUp}>
                    <form onSubmit={this.handleSubmitSignUp} action="#">
                        <h1>Create Account</h1>
                        <span>Use your email for registration</span>
                        <input type="email" className="form-control" placeholder ='Email' name="email" value={user.email} onChange={this.handleChangeSignUp} />
                        {submittedSignUp && !user.email &&
                            <div className="help-block">Email is required</div>
                        }
                        <input type="text" className="form-control" placeholder ='Username' name="username" value={user.username} onChange={this.handleChangeSignUp} />
                        {submittedSignUp && !user.username &&
                            <div className="help-block">Username is required</div>
                        }
                        
                        <input type="text" className="form-control" placeholder ='Password' name="password" value={user.password} onChange={this.handleChangeSignUp} />
                        {submittedSignUp && !user.password &&
                            <div className="help-block">Password is required</div>
                        }
                        <button >Sign Up</button>
                        {registering && 
                            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                        }
                    </form>
                    </div>
                    <div className={"form-container sign-in-container "}>
                    <form onSubmit={this.handleSubmit} action="#">
                        <h1>Sign in</h1>
                    
                        <span>or use your account</span>
                        <input type="email" className="form-control" placeholder="Email" name="username" value={username} onChange={this.handleChange} />
                        {submitted && !username &&
                            <div className="help-block">Username is required</div>
                        }
                        <input type="password" className="form-control" placeholder="Password" name="password" value={password} onChange={this.handleChange} />
                        {submitted && !password &&
                            <div className="help-block">Password is required</div>
                        }
                        <a href="#">Forgot your password?</a>
                        <button >Sign In</button>
                        {loggingIn &&
                            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                        }
                    </form>
                    </div>
                    <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                        <h1>Welcome Back!</h1>
                        <p>To keep connected with us please login with your personal info</p>
                        <button onClick ={this.handleSwitch} className="ghost" id="signIn">Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                        <h1>Hello, Friend!</h1>
                        <p>Enter your personal details and start journey with us</p>
                        <button onClick={this.handleSwitch} className="ghost" id="signUp">Sign Up</button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { loggingIn } = state.authentication;
    const { registering } = state.registration;
    return {
        loggingIn,
        registering
    };
}

const connectedLoginPage = connect(mapStateToProps)(LoginPage);
export { connectedLoginPage as LoginPage }; 