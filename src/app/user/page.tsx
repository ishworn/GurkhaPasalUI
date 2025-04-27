import React from 'react';

import  Hero  from '@/components/user/Hero/hero';
import { Navbar } from '@/components/user/Layout/Navbar';
import  Footer  from '@/components/user/Layout/Footer';



function UserHome() {
  return (
    <>
    <Navbar />
   
      < Hero />
     
     <Footer />
   
     
    </>
  )
}

export default UserHome