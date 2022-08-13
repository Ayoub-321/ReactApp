import React, { useEffect, useState } from 'react';
// import  axios  from 'axios';
import { Activity } from '../models/activity';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';


function App() {
  const[activities, setActivities] = useState<Activity[]>([]);
  const[selectedActivity, setselectedActivity] = useState<Activity | undefined>(undefined);
  const[EditMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
    setSubmitting(true);
    if(activity.id) {
      agent.Activities.update(activity, activity.id).then(()=> {
        setActivities([...activities.filter(x => x.id !== activity.id), activity]);
        setselectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    } else{
      activity.id = uuid();
      agent.Activities.create(activity).then(()=>{
        setActivities([...activities, activity]);
        setselectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    }
    // activity.id 
    //   ? setActivities([...activities.filter(x => x.id !== activity.id), activity])
    //   : setActivities([...activities, {...activity, id: uuid()}]);
    // setEditMode(false);
    // setselectedActivity(activity);  
    
  }

  function handleDeleteActivity(id: string){
    setSubmitting(true);
    agent.Activities.delete(id).then(() =>{
      setActivities([...activities.filter(x => x.id !== id)]);
      setSubmitting(false);
    })
  }

  useEffect( () => {
    // axios.get<Activity[]>('/api/activities').then(response => {
    //   console.log(response);
    //   setActivities(response.data);
    // })

    agent.Activities.list().then(response => {
      let activities: Activity[] = [];
      response.forEach(activity =>{
        // activity.date = activity.date.split('T')[0];
        activities.push(activity);
      })
      
      setActivities(activities);
      setLoading(false);
    })
  }, []);

  if(loading) return <LoadingComponent content='Loading App...'/>
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
          submitting={submitting}
        />
        </Container>
        
      
    </>
  );
}

export default App;
