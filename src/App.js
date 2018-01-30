import React, { Component } from 'react';
import './App.css';
import { Layout, Menu, Breadcrumb, Icon} from 'antd';
import NewNonPerformingLoan from './components/NonPerformingLoan/new';
import RepaymentNonPerformingLoan from './components/NonPerformingLoan/repayment';
import ReviewNonPerformingLoan from './components/NonPerformingLoan/review';
import ComputeNonPerformingLoan from './components/NonPerformingLoan/compute';
import CloseNonPerformingLoan from './components/NonPerformingLoan/close';
import PresentType from './components/present/presentType';
import PresentRecord from './components/present/presentRecord';
import PresentDistribute from './components/present/presentDistribute';
import {connect} from 'react-redux';


const {SubMenu} = Menu;
const {Header,Footer,Sider,Content} = Layout;
const BreadcrumbItem = Breadcrumb.Item;


class App extends Component {

    constructor(props){
        super(props);

        //绑定函数到this
        this.onMenuClick = this.onMenuClick.bind(this);
        this.getCnTitle = this.getCnTitle.bind(this);
        this.getCurrentMenuContent = this.getCurrentMenuContent.bind(this);

        //设置初始状态
        this.state = {
            breadCrumb: ["不良贷款","贷款计息"],
            currentMenuKey: "compute",
            fetching: false
        };
    }

    componentWillMount(){}


    onMenuClick= (e)=> {
        this.setState ({
            breadCrumb: e.keyPath.reverse(),
            currentMenuKey: e.key
        });
    };

    getCnTitle = (enTitle) =>{
        switch(enTitle){
            case "nonPerformingLoan": return "不良贷款";
            case "new": return "新增";
            case "repayment": return "还本还息";
            case "review": return "查看所有";
            case "compute": return "计算利息";
            case "close": return "销户";
            case "不良贷款": return "不良贷款";
            case "贷款计息": return "贷款计息";
            case "present": return "礼品管理";
            case "presentType": return "礼品种类";
            case "presentDistribute": return "礼品发放";
            case "presentRecord": return "领取记录";

            default: return "错误";
        }
    };

    getCurrentMenuContent = ()=>{
        switch (this.state.currentMenuKey){
            case "new": return <NewNonPerformingLoan/>
            case "repayment": return <RepaymentNonPerformingLoan/>
            case "compute": return <ComputeNonPerformingLoan/>
            case "close": return <CloseNonPerformingLoan/>
            case "review": return <ReviewNonPerformingLoan/>
            case "presentType": return <PresentType/>
            case "presentRecord": return <PresentRecord/>
            case "presentDistribute": return <PresentDistribute/>

            default: return <div>系统错误，请联系管理员</div>
        }
    }

  render() {

    const styleImage = {
        display: "block",
        width: '40px',
        height: '40px',
        marginTop:'10px',
        marginRight:'10px'
    };

    return (
        <div style={{height:'100%'}}>
        <Layout style={{height: '100%'}}>
            <Header className="header">

                <div className="header-logo">
                    <div>
                        <img src={require('./image/logo1.png')} style={styleImage} />
                    </div>
                    <h2 style={{color:'#fff'}}>伊金霍洛农村商业银行数据分析系统</h2>
                </div>
            </Header>
            <Layout style={{height: '100%'}}>
                <Sider width={220} style={{ background: '#fff'}} collapsible>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['compute']}
                        defaultOpenKeys={['nonPerformingLoan']}
                        style={{ height: '100%', borderRight: 0}}
                        onClick={this.onMenuClick}
                    >
                        <SubMenu key="nonPerformingLoan" title={<span style={{fontSize:'16px'}}><Icon type="user" />不良贷款</span>}>
                            <Menu.Item key="new" style={{fontSize:'13px'}}>新增贷款</Menu.Item>
                            <Menu.Item key="repayment" style={{fontSize:'13px'}}>还款记录</Menu.Item>
                            <Menu.Item key="compute" style={{fontSize:'13px'}}>贷款计息</Menu.Item>
                            <Menu.Item key="close" style={{fontSize:'13px'}}>贷款销户</Menu.Item>
                        </SubMenu>
                        <SubMenu key="present" title={<span style={{fontSize:'16px'}}><Icon type="appstore" />礼品管理</span>}>
                            <Menu.Item key="presentType" style={{fontSize:'13px'}}>礼品种类</Menu.Item>
                            <Menu.Item key="presentDistribute" style={{fontSize:'13px'}}>礼品发放</Menu.Item>
                            <Menu.Item key="presentRecord" style={{fontSize:'13px'}}>领取记录</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout style={{ padding: '0 24px 24px'}}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        {
                            this.state.breadCrumb.map((title,index)=>{
                                let cnTitle = this.getCnTitle(title);
                                return <BreadcrumbItem key={index}>{cnTitle}</BreadcrumbItem>
                            })
                        }
                    </Breadcrumb>
                    <Content style={{ background: '#fff', padding: 24, margin: 0, height: '100%'}}>
                        {
                            this.getCurrentMenuContent()
                        }
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        &copy;&nbsp;2012 伊金霍洛农村商业银行. All Rights Reserved.
                    </Footer>
                </Layout>

            </Layout>
        </Layout>
        </div>
    );
  }
}


function mapStateToProps(state) {
    return {
        value: state.counter,
        fetchingData: state.fetchingData,
        receivedLoginStatus: state.receivedLoginStatus,
        loggedIn: state.loggedIn
    }
}


const increaseAction = { type: 'increase' };

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
    return {
        onIncreaseClick: () => dispatch(increaseAction),
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(App);

