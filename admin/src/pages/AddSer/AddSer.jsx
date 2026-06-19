import React from 'react'
import Navbar from "../../components/Navbar/Navbar";
import AddService from '../../components/AddService/AddService';
import { useParams } from 'react-router-dom';
const AddSer = () => {
  const { id } = useParams();
  return (
    <div>
         <Navbar/>
             <AddService serviceId={id} />
    </div>
  )
}

export default AddSer