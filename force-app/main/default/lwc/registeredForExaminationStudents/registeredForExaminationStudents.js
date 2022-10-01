import { api, LightningElement, wire, track } from 'lwc';
import getStudents from '@salesforce/apex/StudentController.getStudents';
import getExamination from '@salesforce/apex/ExaminationController.getExamination';
import getSubject from '@salesforce/apex/SubjectController.getSubject';
import {updateRecord} from 'lightning/uiRecordApi';
import ID_FIELD from '@salesforce/schema/Student__c.Id';
import STUDENT_EXAM_FIELD from '@salesforce/schema/Student__c.Examination__c';


export default class RegisteredForExaminationStudents extends LightningElement {

    @api
    students;

    @api 
    recordId;

    @api
    studentId;

    @api
    examination;

    @api
    subject;

    @wire(getExamination, { recordId: '$recordId' })
    exmntns({ error, data }) {
        if (data) {
            this.examination = data.Classroom__c;

            getSubject({recordId : data.Subject__c})
            .then(data => {
                this.subject = data.Name;
            })
            .catch(error => {
                console.log(error)
            });
        } 
        else if (error) {
            console.log('Something went wrong fetching the examination:', error);
        }
    }
    @wire(getStudents, { recordId: '$recordId' })
    stdnts({ error, data }) {
        if (data) {
            this.students = data;
        } else if (error) {
            console.log('Something went wrong fetching the students:', error);
        }
    }
    
    examWithdrawal(event) {

        try {
            let id = event.target.value;
            let fields = {};

            fields[ID_FIELD.fieldApiName] = id;
            fields[STUDENT_EXAM_FIELD.fieldApiName] = "";

            const recordInput = { fields };

            console.log("id: " + fields[ID_FIELD.fieldApiName]);
            console.log("id: " + fields[STUDENT_EXAM_FIELD.fieldApiName]);

            updateRecord(recordInput)
            .then(s => {

                window.location.reload()
            })
            .catch(error => {
                console.log("Error: ", error);
            });
        }
        catch(error) {
            console.log("Error", error)
        }
    }
}