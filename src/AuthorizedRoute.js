import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { getLoggedUser } from './utils/xhr'
import {Icon} from 'antd';

class AuthorizedRoute extends React.Component {

    componentWillMount() {
        getLoggedUser()
    }

    render() {
        const { component: Component, pending, logged, ...rest } = this.props;

        return (
            <Route {...rest} render={props => {
                if (pending) return <div><Icon type="loading" /></div>
                if(logged === true) console.log('用户已经登陆');
                return logged
                    ? <Component {...props} style={{height: '100%'}} /> //使conent内容充满全屏幕
                    : <Redirect to="/auth/login" />
            }} />
        )
    }
}

const stateToProps = ({ loggedUserState }) => ({
    pending: loggedUserState.pending,
    logged: loggedUserState.logged
})

export default connect(stateToProps)(AuthorizedRoute)