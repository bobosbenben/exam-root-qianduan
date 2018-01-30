import React,{Component} from 'react';
import { Form, Icon, Input, Button, Select, DatePicker, message, Spin } from 'antd';
import './widget.css';
import moment from 'moment';
const Option = Select.Option;
const FormItem = Form.Item;

class UpdateNonPerformingLoanWindow extends Component {

    constructor(props){
        super(props);
        this.state = {
            record: props.currentRow,
            pushingData: false
        };

        console.log('子组件接收到的参数是：',this.state.record);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({record: nextProps.currentRow});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {

                this.setState({
                    pushingData: true
                });
                let url = '/bldk/nonperformingloan/update';
                fetch(url,{
                    credentials: 'include',
                    method: 'POST',
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
                    body: JSON.stringify({
                        data: [{
                            id: this.state.record.id,
                            principal: values.principal,
                            interest: values.interest,
                            compoundInterest: values.compoundInterest,
                            fxRate: values.fxRate,
                            hxDate: values.hxDate,
                            beforeHxInterest: values.beforeHxInterest,
                            interestTerm: values.interestTerm
                        }]
                    }),
                })
                    .then(res => res.json())
                    .then(data => {
                        this.setState({
                            pushingData: false
                        });
                        if (data.success === false ) {
                            message.error(data.msg);
                        }
                        if (data.success === true){
                            message.success(data.msg);
                            this.props.refreshColumn();
                        }
                    });
            }
        });
    }

    render(){
        const dataFormat = 'YYYY-MM-DD';
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };

        return(
            <Spin spinning={this.state.pushingData} tip='正在修改...'>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        label="贷款帐号"
                    >
                        {getFieldDecorator('accountNo', {
                            initialValue: this.state.record.accountNo
                        })(
                            <Input disabled={true}/>
                        )}
                    </FormItem>
                    <FormItem
                        label="户名"
                    >
                        {getFieldDecorator('customerName', {
                            initialValue: this.state.record.customerName
                        })(
                            <Input disabled={true}/>
                        )}
                    </FormItem>
                    <FormItem
                        label="核销时本金"
                    >
                        {getFieldDecorator('principal', {
                            initialValue: this.state.record.principal,
                            rules: [{
                                required: true, message: '请输入核销时本金!',
                            }],
                        })(
                            <Input addonBefore="￥" />
                        )}
                    </FormItem>
                    <FormItem
                        label="核销时利息"
                    >
                        {getFieldDecorator('interest', {
                            initialValue: this.state.record.interest,
                            rules: [{
                                required: true, message: '请输入核销时利息!',
                            }],
                        })(
                            <Input  addonBefore="￥" />
                        )}
                    </FormItem>
                    <FormItem
                        label="核销时复利"
                    >
                        {getFieldDecorator('compoundInterest', {
                            initialValue: this.state.record.compoundInterest,
                            rules: [{
                                required: true, message: '请输入核销时复利!',
                            }],
                        })(
                            <Input  addonBefore="￥" />
                        )}
                    </FormItem>
                    <FormItem
                        label="罚息利率"
                    >
                        {getFieldDecorator('fxRate', {
                            rules: [{
                                required: true, message: '请输入罚息利率!',
                            }],
                            initialValue: this.state.record.fxRate
                        })(

                            <Input style={{ width: '100%' }} addonBefore="‰" />
                        )}
                    </FormItem>
                    <FormItem
                        label="核销日期"
                    >
                        {getFieldDecorator('hxDate', {
                            rules: [{ type: 'object', required: true, message: '请输入核销日期!' }],
                            initialValue: moment(this.state.record.hxDate,dataFormat)
                        })(
                            <DatePicker style={{width:'50%'}}/>
                        )}
                    </FormItem>
                    <FormItem
                        label="核销前最后一期利息"
                    >
                        {getFieldDecorator('beforeHxInterest', {
                            rules: [{
                                required: true, message: '核销前最后一次结息时的利息总金额!',
                            }],
                            initialValue: this.state.record.beforeHxInterest
                        })(

                            <Input style={{ width: '100%' }} addonBefore="￥" />
                        )}
                    </FormItem>
                    <FormItem
                        label="结息周期"
                    >
                        {getFieldDecorator('interestTerm', {
                            rules: [{ required: true, message: '请选择结息周期!', whitespace: true }],
                            initialValue: this.state.record.interestTerm
                        })(
                            <Select style={{ width: '50%' }}>
                                <Option value="0">按月</Option>
                                <Option value="1">按季</Option>
                                <Option value="2">按年</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">修改</Button>
                    </FormItem>
                </Form>
            </Spin>
        )
    }
}

export default Form.create()(UpdateNonPerformingLoanWindow);