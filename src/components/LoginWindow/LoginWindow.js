import React,{Component} from 'react';
import {Row} from 'antd';
import {
    Icon,
    Form,
    Input,
    Button,
    CheckBox,
    Card,
    Alert
} from 'antd';
import './loginwindow.css';
import {login} from '../../utils/xhr';
const FormItem = Form.Item;

class LoginWindow extends Component {

    constructor(props){
        super(props);
        this.state={
            userid:'',
            usercode: '',
            password: '',
            hasLogedin: false,
            isShowWarning: false
        }
    }

    componentWillMount(){

    };

    componentDidMount(){
        this.props.form.hideRequiredMark=true;

    }

    handleSubmit(e){
        e.preventDefault();//禁止冒泡

        let formData = this.props.form.getFieldsValue();

        this.props.form.validateFields({ force: true },
            (err, values) => {
                if (!err) {
                    login(values.usercode,values.password)
                        .then((data)=>{
                        if (data.logged === true) this.props.history.push('/app');
                        // this.props.history.push('/app');
                    });

                }
            }
        );
    }

    renderMessage = (message) => {
        return (
            <Alert
                style={{ marginBottom: 24 }}
                message={message}
                type="error"
                showIcon
            />
        );
    }

    render(){

        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };

        return(
            <div style={{display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginTop:'10%'}}>
                <div style={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
                    <div>
                        <img src={require('../../image/logo1.png')} style={{width:'40px', height:'45px', paddingBottom:'10px'}}/>
                    </div>
                    <div style={{marginTop:'5px',marginLeft:'10px'}}>
                        <h2>核销贷款利息试算系统</h2>
                    </div>
                </div>

                <Card title="登录" bordered={true} hoverable="true" style={{width:'500px',textAlign:'center'}}>
                    <Form className="login-form" hideRequiredMark={true} onSubmit={this.handleSubmit.bind(this)}>
                        <FormItem {...formItemLayout} label="柜员号">
                            {getFieldDecorator('usercode', {
                                rules: [{ required: true,message:'柜员号为空！'}],
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                            )}

                        </FormItem>
                        <FormItem {...formItemLayout} label="密码">
                            {getFieldDecorator('password', {
                                rules: [{ required: true,message:'密码为空！'}],
                            })(
                                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="错误" style={{display: this.state.isShowWarning?'block':'none'}}>
                            {
                                this.renderMessage('柜员号或密码错误！')
                            }
                        </FormItem>
                        <FormItem>
                            <Button type="primary" size="large" htmlType="submit">登录</Button>
                        </FormItem>
                    </Form>
                </Card>
            </div>

                    <Row>

                        {/*<Col span={} >*/}
                            <div style={{position:'fixed',bottom:'0',textAlign:'center',width:'100%',paddingBottom:'30px',fontSize:'15px',marginTop:'100px'}}>
                                &copy;&nbsp;2012 伊金霍洛农村商业银行股份有限公司. All Rights Reserved.
                            </div>
                        {/*</Col>*/}

                    </Row>

            </div>
        );
    }


}

LoginWindow = Form.create({})(LoginWindow);
export default LoginWindow;
