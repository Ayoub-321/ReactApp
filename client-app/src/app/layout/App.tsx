import React from 'react';
import {  Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';

function App() {

  const location = useLocation();
  return (
    <>
      <Route path='/' element={<HomePage />}/>
      
        
          
            <NavBar />
              <Container style={{marginTop: '7em'}}>
              <Routes>
                <Route path='/activities' element={<ActivityDashboard />}/>
                <Route   path='/activities/:id' element={<ActivityDetails />}/>
                <Route key={location.key} path='/createActivity'element={<ActivityForm />}/>
              </Routes>
              </Container>  
          
        
      
          
    </>
  );
}

export default observer (App) ;
