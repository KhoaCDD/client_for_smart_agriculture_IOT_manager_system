import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { userActions } from '../_actions';
import {Modal, Button, Input} from 'react-bootstrap'
import c3 from 'c3';
import 'c3/c3.css';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { userService } from '../_services';
class HomePage extends React.Component {

    constructor(props) {
        super(props);
        this.chart = React.createRef();
        this.DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};

        this.state = {
            dataStatus: this.DATA_STATUS.QUERYING,
            showModal: false,
            deviceId:'',
            deviceName:'',
            deviceType:'',
            deviceStatus:'',
            deviceMac:'',
            displayDevice:''
        };
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addDevice = this.addDevice.bind(this);
        this.handleSelectDisplay=this.handleSelectDisplay.bind(this)
        this.fetchUsersWithFetchAPI =this.fetchUsersWithFetchAPI.bind(this);
    }
    componentDidMount() {
        //this.props.dispatch(userActions.getAll());
        this.props.dispatch(userActions.getAllDevice());
        this.setState(state => {
            return {
                ...state,
                dataStatus: this.DATA_STATUS.QUERYING,
            };
        });
        this.fetchUsersWithFetchAPI(this.state.displayDevice);
        this.timer = setInterval(() => this.fetchUsersWithFetchAPI(this.state.displayDevice), 3000);

        
    }
    shouldComponentUpdate (nextProps, nextState){
        if(nextState.showModal !== this.state.showModal){
            return true;
        }
        if(this.props.users.devices !== nextProps.users.devices ){
            return true;
        }
        if(this.props.users.device !== nextProps.users.device ){
            return true;
        }
        if (this.state.displayDevice != nextState.displayDevice ) {
            this.props.dispatch(userActions.getDataChart(nextState.displayDevice));
            
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                };
            });

            return false;
        }
    
        if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if (!nextProps.users.items || !nextProps.users.devices)
                return false;
            
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE,
                };
            });
            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.AVAILABLE){
            this.pieChart();

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED,
                };
            });
        }
        
      
        return true;
    }


    fetchUsersWithFetchAPI (id) {
        if(id){
            this.setState({...this.state, isFetching: true});
            userService.getNewestData(id)
            .then(response => response.json())
            .then(result => {
                this.setState({temp: result, isFetching: false})
            })
            .catch(e => {
                console.log(e);
                this.setState({...this.state, isFetching: false});
            });
        }
    };
    handleSelectDisplayConfirmBox(device){
        confirmAlert({
            title: 'Confirm to select device to display data.',
            message: 'Are you sure to display data of '+ device.deviceName +"?",
            buttons: [
              {
                label: 'Yes',
                onClick: () => this.handleSelectDisplay(device.id)
              },
              {
                label: 'No',
                onClick: () => {}
              }
            ]
          });
            
    }
    handleSelectDisplay(id){
        
        this.setState(state => {
            return {
                ...state,
                displayDevice: id,
            };
        });
        
    }

     /**Xóa các chart đã render khi chưa đủ dữ liệu */
     removePreviousChart(){
        const chart = this.chart.current;
        while(chart.hasChildNodes()){
            chart.removeChild(chart.lastChild);
        }
    } 

    /**Thiết lập dữ liệu biểu đồ */
    setDataPieChart () {
        const { users } = this.props;
        let data, dataPieChart;

        if (users.items) {
            data = users.items.data;
        }
        if(data){
            let time = data.result.map(item =>{

                let unix_timestamp = item.timestamp;
                // Create a new JavaScript Date object based on the timestamp
                // multiplied by 1000 so that the argument is in milliseconds, not seconds.
                var date = new Date(unix_timestamp * 1000);
                // Hours part from the timestamp
                var hours = date.getHours();
                // Minutes part from the timestamp
                var minutes = "0" + date.getMinutes();
                // Seconds part from the timestamp
                var seconds = "0" + date.getSeconds();

                // Will display time in 10:30:23 format
                var formattedTime = minutes.substr(-2) + ':' + seconds.substr(-2); 
                return {
                    formattedTime
                }
            })
            let temp = data.result.map(item =>{
                let x= item.data.T5
                return x;
            })
            let h = data.result.map(item =>{
                let x= item.data.H5
                return x
            })
            let tempe = ['Temperature'].concat(temp);
            let moisture= ["Moisture"].concat(h);
            return{
                tempe,
                moisture
            }
        }

        
    }

    /**Khởi tạo PieChart bằng C3 */
    pieChart() {
        this.removePreviousChart();

        // Tạo mảng dữ liệu
        let dataChart;
        dataChart = this.setDataPieChart(); 
        console.log('\n\n\n\n\n\n\n\n\n\n\n\n',dataChart);
        const chart = this.chart.current;
        this.chart = c3.generate({
            bindto: chart,             // Đẩy chart vào thẻ div có id="pieChart"

            // Căn lề biểu đồ
            
        
            data: {                                 // Dữ liệu biểu đồ
                columns: [
                    dataChart.tempe,
                    dataChart.moisture
                  ],
                type : 'line',
            }
        });
    }
    sendDataOnOff(device){
        if(device.status === "running"){
            device.status = "active";
        }
        else{
            device.status = "running";
        }
        this.props.dispatch(userActions.sendDataOnOff(device));
    }
    handleToggleButton(device){
        confirmAlert({
            title: 'Confirm to ON/OFF',
            message: 'Are you sure to turn ' +(device.status !== "active"?"OFF":"ON") +" "+device.deviceName,
            buttons: [
              {
                label: 'Yes',
                onClick: () => this.sendDataOnOff(device)
              },
              {
                label: 'No',
                onClick: () => {}
              }
            ]
          });
            
    }
    /**
     * Modal Func
     */
    handleClose(){
        this.setState(state => {
            return {
                ...state,
                showModal: false,
            };
        });        
    }
    handleShow(){
        this.setState(state => {
            return {
                ...state,
                showModal: true,
            };
        });        
    }
    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    addDevice(){
        let device={
            mac: this.state.deviceMac,
            deviceName:this.state.deviceName,
            deviceType: this.state.deviceType,
            deviceId: this.state.deviceId,
            status: this.state.deviceStatus
        }
        this.props.dispatch(userActions.createDevice(device));
        this.setState(state => {
            return {
                ...state,
                showModal: false,
            };
        });    
    }
    render() {
        var { showModal } =this.state;
        const { user, users} = this.props;
        let devices;
        if(users.devices){
            devices = users.devices;
            
        }      

        return (
            <div className ="homepage">
                <Modal show={this.state.showModal} onHide={this.handleClose} animation={false}>
                    <Modal.Header closeButton>
                    <Modal.Title>Add Device</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form >
                            <div>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                    <label htmlFor="inputEmail4">Device ID</label>
                                    <input type="text" name='deviceId' className="form-control" id="inputEmail4" placeholder="ID" onChange={this.handleChange}/>
                                    </div>
                                    <div className="form-group col-md-6">
                                    <label htmlFor="inputPassword4">Device Name</label>
                                    <input type="text" name='deviceName' className="form-control" id="inputPassword4" placeholder="Device name" onChange={this.handleChange}/>
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="inputCity">Device Type</label>
                                        <input type="text" name='deviceType' className="form-control" id="inputCity" placeholder="Device type" onChange={this.handleChange}/>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label htmlFor="inputCity">Device Status</label>
                                        <input type="text" name='deviceStatus'className="form-control" id="inputCity" placeholder="Device Status" onChange={this.handleChange} />
                                    </div>
                                    
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-8">
                                        <label htmlFor="inputCity">Device Mac Address</label>
                                        <input type="text" name='deviceMac' className="form-control" id="inputCity" placeholder="Device Mac" onChange={this.handleChange}/>
                                    </div>
                                    
                                    
                                </div>
                                
                            </div>                            
                        </form>                          
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.addDevice}>
                        Add Device
                    </Button>
                    </Modal.Footer>
                </Modal>
                <div className= 'chart-box-homepage'>
                    <h3>Data Chart:</h3>
                    {users.loading && <em>Loading users...</em>}
                    {users.error && <span className="text-danger">ERROR: {users.error}</span>}
                    <div id='chart'></div>
                    <section className = "chart-homepage" ref={this.chart}></section>
                </div>
                <div className="device-homepage">
                    <div>
                        <div className="homepage-header-table">
                            <h3>List Device</h3>
                            {this.state.temp?<h3>Current Temperature: {this.state.temp.data.data["T"+this.state.temp.data.deviceId]}</h3>:<div></div>}
                            {this.state.temp?<h3>Current Moisture: {this.state.temp.data.data["H"+this.state.temp.data.deviceId]}</h3>:<div></div>}
                            <button className ="color-edited-button" onClick={this.handleShow}>Add Device</button>
                        </div>
                        <table className="styled-table">
                            <thead>
                                <tr>
                                    <th>Device ID</th>
                                    <th>Device Name</th>
                                    <th>Device Type</th>
                                    <th>Status</th>                                    
                                    <th>Action</th>
                                    <th>On/Off</th>
                                </tr>
                            </thead>
                            <tbody>            
                                {
                                    (typeof(devices) !== 'undefined' && devices.length !== 0 )?
                                    devices.map(item=> item && 
                                        <tr key = {item.deviceId}>
                                            <td title = {item.deviceId}>{item.deviceId}</td>
                                            <td title = {item.deviceName}>{item.deviceName}</td>
                                            <td title = {item.deviceType}>{item.deviceType}</td>
                                            <td title = {item.status}>{item.status}</td>
                                            
                                            <td>
                                                <input type="checkbox" id={"checkbox"+item.deviceId} checked ={this.state.displayDevice===item.id} onChange={()=>this.handleSelectDisplayConfirmBox(item)} disabled = {(item.status === "active")? "disabled" : ""}/>
                                                <label htmlFor={"checkbox"+item.deviceId}>Display data</label>
                                            </td>
                                            <td>
                                                <label className="switch">
                                                    <input type="checkbox" id={"slider"+item.deviceId} checked ={item.status !== "active"} onChange={()=>this.handleToggleButton(item)}/>
                                                    <span className="slider round"></span>
                                                </label>
                                            </td>
                                        </tr>

                                    ):<tr><td>No Data</td></tr>
                                }                
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
            
        );
    }
}

function mapStateToProps(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return {
        user,
        users
    };
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage };