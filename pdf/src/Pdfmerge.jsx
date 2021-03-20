import React, { Component } from 'react';
import axios from 'axios';
import ProgressBar from 'react-bootstrap/ProgressBar'
import './App.css';

class Pdfmerge extends Component {
    constructor(props) {
        super(props)
        this.state = {
            record: [],
            status:0,
            isVisible:false,
            result:'',
            down:false,
        }
    }
    uploadFile(event) {
        this.setState({
            record:event.target.files
        })
    }

    handle(event) {
        event.preventDefault();
        this.setState({
            isVisible:true,
            down:true
        })
        let formData = new FormData();
        for (let i = 0; i < this.state.record.length; i++) {
            formData.append(`files`, this.state.record[i])
            console.log(this.state.record[i])
        }
        axios.post('http://localhost:9000/pdf', formData,
        {onUploadProgress:(progressEvent)=>{
            this.setState({
                status:Math.round(progressEvent.loaded*100)/progressEvent.total
            })
        }})
            .then((res) => {
                this.setState({
                    result:res.data
                })
                console.log(res.data)
            }).catch((err) => {
                console.log(err)
            })
        setTimeout(()=>{
            this.setState({
                isVisible:false
            })
        },10000)
    }
    render() {
        return (
            <div className="row">
                <div className="col-sm-4"></div>
                <div className="col-sm-4 design">
                    <div className="row">
                        <h1>This is a online Pdf Merger</h1>
                        <p>You can merge upto 100 pdf files in single time.</p>
                    </div>
                    <form onSubmit={this.handle.bind(this)} encType='multipart/form-data'>
                        <div className="form-group">
                            <h3>UPLOAD FILES:</h3>
                            <input type="file" multiple onChange={this.uploadFile.bind(this)} accept="application/pdf" className="form-control" />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">Upload</button>
                        </div>
                    </form>
                    {this.state.isVisible?<ProgressBar animated now={this.state.status} label={`${this.state.status}%`} />:''}
                    <br/>
                    {this.state.down?<a href={`http://localhost:9000/public/${this.state.result}`} download target="_blank" rel="noreferrer" className="btn btn-default">Download</a>:''}
                </div>
                <div className="col-sm-4"></div>
            </div>
        )
    }
}

export default Pdfmerge
