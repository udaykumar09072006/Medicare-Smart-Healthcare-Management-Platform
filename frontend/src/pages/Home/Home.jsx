import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Banner from '../../components/Banner/Banner'
import Certification from '../../components/Certification/Certification'
import HomeDoctors from '../../components/HomeDoctors/HomeDoctors'
import Testimonial from '../../components/Testimonial/Testimonial'
import Footer from '../../components/Footer/Footer'


const Home = () => {
  return (
    <div>
        <Navbar/>
        <Banner/>
        <Certification/>
        <HomeDoctors/>
        <Testimonial/>
        <Footer/>
    </div>
  )
}

export default Home