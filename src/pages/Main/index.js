import React, { Component } from 'react';

import './styles.css';
import api from "../../services/api";

class Main extends Component {
    state = {
        newBox: '',
    };


    handleSubmit = async (e) =>{
        e.preventDefault(); //evitar o redirect do form
        
        const response = await api.post("/boxes",{  //Criar uma box usando axios e o state
            title: this.state.newBox,
        });

        this.props.history.push(`/box/${response.data._id}`);

        console.log(response.data);
    };

    handleInputChange = (e) =>{
        this.setState({newBox: e.target.value});    //Muda o Estado do nome da box quando crio uma nova
    }

  render() {
    return(
        <div id="main-container">
            <form onSubmit={this.handleSubmit}>
                <input 
                    placeholder="Criar uma box" 
                    value = {this.state.newBox}
                    onChange = {this.handleInputChange}/>
                <button type="submit">Criar</button>
            </form>
        </div>
    );
  }
}

export default Main