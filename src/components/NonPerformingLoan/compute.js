import React,{Component} from 'react';
import { Table, Button, Modal, message } from 'antd';
import RepaymentWindow from './widgets/RepaymentWindow';
import ComputeWindow from './widgets/ComputeWindow';
import './nonPerformingLoan.css'
require('es6-promise').polyfill();
require('isomorphic-fetch');

const columns = [{
    title: '帐号',
    dataIndex: 'accountNo',
    key: 'accountNo',
    width: '20%'
},{
    title: '户名',
    dataIndex: 'customerName',
    key: 'customerName',
    width: '20%'
},{
    title: '结息周期',
    dataIndex: 'interestTerm',
    key: 'interestTerm',
    width: '15%'
},{
    title: '核销本金',
    dataIndex: 'principal',
    key: 'principal',
    width: '15%'
},{
    title: '核销利息',
    dataIndex: 'interest',
    key: 'interest',
    width: '15%'
},{
    title: '核销复利',
    dataIndex: 'compoundInterest',
    key: 'compoundInterest',
    width: '15%'
}];



export default class ComputeNonPerformingLoan extends Component {

    constructor(){
        super();

        this.state = {
            data: [],
            pagination: {},
            loading: false,
            modalRepaymentWindowVisible: false,
            modalComputeWindowVisible: false,
            confirmLoading: false,
            selectedRowKeys: [],  // Check here to configure the default column
            pageSize: 7,
            currentSelectRow: null
        };

        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.showRepaymentWindowModal = this.showRepaymentWindowModal.bind(this);
        this.showComputeWindowModal = this.showComputeWindowModal.bind(this);
        // this.onSelectChange = this.onSelectChange.bind(this);
    }

    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.fetchData({
            limit: pagination.pageSize,
            page: pagination.current,
            start: (pagination.current - 1) * pagination.pageSize
            // sortField: sorter.field,
            // sortOrder: sorter.order,
            // ...filters,
        });
    }
    fetchData = (params = {}) => {
        console.log('params:', params);
        this.setState({ loading: true });

        let url = '/bldk/nonperformingloan/get';
        fetch(url,{
            credentials: 'include',
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
            body: JSON.stringify({
                limit: this.state.pageSize,
                ...params
            }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.success === false){
                    message.error(data.msg);
                }
                else {
                    const pagination = {...this.state.pagination};
                    pagination.pageSize = this.state.pageSize;
                    pagination.total = data.total;
                    this.setState({
                        data: data.data,
                        pagination
                    });
                    // console.log('received data'); console.log(data.data);
                }
                this.setState({
                    loading: false
                })

            })
    }

    componentDidMount(){
        this.fetchData({
            start: 0,
            page: 1
        });
    }

    showRepaymentWindowModal = () => {

        //判断是否已经选中一条记录
        let record = this.state.currentSelectRow;
        if (record === undefined || record === null || record.id === undefined ){
            message.info('请先选中要操作的记录');
        }
        else {
            //如果选中记录，则显示其内容
            this.setState({
                modalRepaymentWindowVisible: true
            });
        }

    }

    showComputeWindowModal = ()=>{
        let record = this.state.currentSelectRow;
        if (record === undefined || record === null || record.id === undefined ){
            message.info('请先选中要操作的记录');
        }
        else {
            //如果选中记录，则显示其内容
            this.setState({
                modalComputeWindowVisible: true
            });
        }
    }

    handleOk = () => {
        this.setState({
            ModalText: 'The modal dialog will be closed after two seconds',
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                modalRepaymentWindowVisible: false,
                confirmLoading: false,
            });
        }, 2000);
    }
    handleCancel = () => {
        this.setState({
            modalRepaymentWindowVisible: false,
            modalComputeWindowVisible: false
        });
    }

    render(){

        // const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            type: 'radio',
            // onChange: (selectedRowKeys, selectedRows) => {
            //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            // },
            onSelect: (record, selected, selectedRows) => {
                // console.log(record, selected, selectedRows);
                this.setState({
                    currentSelectRow: record
                });
            },
        };

        return(
            <div>
                <div className="review-buttons">
                    <Button onClick={this.showRepaymentWindowModal}>还息</Button>
                    <Button style={{marginLeft:'20px'}} onClick={this.showComputeWindowModal}>计算</Button>
                    <Button style={{marginLeft:'20px'}} onClick={this.showModal}>销户</Button>
                </div>
                <Table columns={columns}
                       rowKey={record => record.id}
                       dataSource={this.state.data}
                       pagination={this.state.pagination}
                       loading={this.state.loading}
                       onChange={this.handleTableChange}
                       rowSelection={rowSelection}
                       scroll={{y:true}}
                />
                <Modal title="还本还息"
                       visible={this.state.modalRepaymentWindowVisible}
                       // onOk={this.handleOk}
                       // confirmLoading={this.state.confirmLoading}
                       onCancel={this.handleCancel}
                       footer={null}
                       width={360}
                >
                    <RepaymentWindow currentRow={this.state.currentSelectRow}/>
                </Modal>
                <Modal
                        title="计息"
                        visible={this.state.modalComputeWindowVisible}
                        onCancel={this.handleCancel}
                        footer={null}
                        width={360}
                >
                    <ComputeWindow currentRow={this.state.currentSelectRow}/>
                </Modal>
            </div>
        )
    }
}