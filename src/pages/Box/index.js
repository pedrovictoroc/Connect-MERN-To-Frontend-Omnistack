import React, { Component } from 'react';
import {distanceInWords} from 'date-fns';
import pt from 'date-fns/locale/pt';
import {MdInsertDriveFile} from 'react-icons/md';
import api from "../../services/api"
import Dropzone from 'react-dropzone';
import "./styles.css";
import socket from "socket.io-client";


class Box extends Component {
  state = {
    box: {}
  }

  async componentDidMount(){
    this.subscribeToNewFiles();

    const box = this.props.match.params.id; //Equivalente do req.params
    const response = await api.get(`/boxes/${box}`);
  
    this.setState({box: response.data});
  }
  
  subscribeToNewFiles = () =>{  //Registrar para receber atualização sempre que o file atualizar
    const box = this.props.match.params.id;
    const io = socket('http://localhost:3333');

    io.emit('connectRoom', box);  //Socket vai ouvir todas as atualizações para essa box
    
    io.on('file', data =>{
      this.setState({box:
        //Usando o principio da imutabilidade copiar os dados de box
        //Entrar em files, copiar os dados presentes nele
        //atualizar os dados adicionando files no state
        { ...this.state.box, 
          files: [data, ...this.state.box.files,]}});
    })
  }

  handleUpload = (files) => {
    files.forEach(file =>{
      const data = new FormData();  //Simula um Data
      const box = this.props.match.params.id; //busca o id para ser adicionado a URL da api
      
      data.append('file',file); //Adiciona informação ao simulador de forms
    
      api.post(`boxes/${box}/files`, data); //faz request da informação pra api
    });
  }

  render() {
      return(
        <div id="box-container">
          <header>
              <h1>{this.state.box.title}</h1>
          </header>

          <Dropzone onDropAccepted = {this.handleUpload}> 
            {({getRootProps,getInputProps}) =>(
                <div className ="upload"
                     {...getRootProps()}>
                  <input {...getInputProps()}/>
                  <p>Arraste arquivos ou clique aqui</p>
                </div>
            )}
          </Dropzone>

          <ul>
            {this.state.box.files && this.state.box.files.map(file=>(
              //Se existir o box.files, executar o map
              <li key={file._id}>
                <a className="fileinfo" href={file.url} target="_blank">
                  <MdInsertDriveFile size={24} color="#A5Cfff"/>
                  <strong>{file.title}</strong>
                </a>
                <span>Há: {distanceInWords(file.createdAt,new Date(),{ //Deixar mais humano a forma de ver a data de alteração
                    locale: pt
                })}</span>
              </li>
              ))}            
          </ul>
        </div>
      );
  }
}

export default Box;