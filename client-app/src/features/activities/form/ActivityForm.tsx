import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import {v4 as uuid} from 'uuid';
import { Link } from "react-router-dom";


export default observer (function ActivityForm(){
    const history = useNavigate();
    const {activityStore} = useStore();
    const {createActivity, updateActivity ,loading, loadActivity, loadingInitial} = activityStore;
    const {id} = useParams<{id: string}>();
    const [activity, setActivity] = useState({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    });

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(activity!))
    }, [id, loadActivity]);

    function handleSubmit(){
        //  createOrEdit(activity);
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity).then(() => history(`/activities/${newActivity.id}`));
        } else {
            updateActivity(activity).then(() => history(`/activities/${activity.id}`));

        }        
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
        const {name, value} = event.target;
        setActivity({...activity, [name]: value})
    }

    if(loadingInitial) return <LoadingComponent content="Loading Activity..."/>

    return(
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input  placeholder='title' value={activity.title} name='title' onChange={handleInputChange}/>
                <Form.Input  placeholder='Description' value={activity.description} name='description'  onChange={handleInputChange}/>
                <Form.Input  placeholder='Category'value={activity.category} name='category'  onChange={handleInputChange}/>
                <Form.Input  type='date' placeholder='Date' value={activity.date} name='date'  onChange={handleInputChange}/>
                <Form.Input  placeholder='City' value={activity.city} name='city'  onChange={handleInputChange}/>
                <Form.Input  placeholder='Venue' value={activity.venue} name='venue'  onChange={handleInputChange}/>
 
                <Button loading={loading} floated="right" positive type='submit' content='Submit'/>
                <Button as={Link} to='/activities' floated="right" positive type='button' content='Cancel'/>

            </Form>
        </Segment>
    )
})