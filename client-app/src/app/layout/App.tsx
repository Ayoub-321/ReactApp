import React, { useEffect, useState } from 'react';
import  axios  from 'axios';
import { Activity } from '../models/activity';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';


function App() {
  const[activities, setActivities] = useState<Activity[]>([]);
  const[selectedActivity, setselectedActivity] = useState<Activity | undefined>(undefined);
  const[EditMode, setEditMode] = useState(false);


  function handelSelectActivity(id: string){
    setselectedActivity(activities.find(x => x.id === id));
  }

  function handelCanceActivity(){
    setselectedActivity(undefined);
  }

  function handleFormOpen(id?: string)
  {
    id ? handelSelectActivity(id) : handelCanceActivity();
    setEditMode(true);
  }


  
  function handleFormClose()
  {
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity)
  {
    activity.id 
      ? setActivities([...activities.filter(x => x.id !== activity.id), activity])
      : setActivities([...activities, {...activity, id: uuid()}]);
    setEditMode(false);
    setselectedActivity(activity);  
    
  }

  function handleDeleteActivity(id: string){
    setActivities([...activities.filter(x => x.id !== id)])
  }

  useEffect( () => {
    axios.get<Activity[]>('/api/activities').then(response => {
      console.log(response);
      setActivities(response.data);
    })
  }, []);
  return (
    <>
      <NavBar  openForm={handleFormOpen}/>
        <Container style={{marginTop: '7em'}}>
        <ActivityDashboard 
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handelSelectActivity}
          cancelSelectActivity={handelCanceActivity}
          editMode={EditMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
        />
        </Container>
        
      
    </>
  );
}

export default App;
