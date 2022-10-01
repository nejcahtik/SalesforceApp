import { LightningElement, wire, api } from 'lwc';
import checkEmsoWithApi from '@salesforce/apex/StudentController.checkEmsoWithApi';
import checkEmso from '@salesforce/apex/StudentController.checkEmso';
import { createRecord } from 'lightning/uiRecordApi';


export default class NewStudentComponent extends LightningElement {
    
    studentName;
    studentSurname;
    studentEmso;
    typeOfStudies = "Full time";
    emsoCheckMethod = "API Call";
    studentGender;
    studentAddress;
    studentBirthday;
    payer = false;

    buttonVisible = true;
    successVisible = false;
    errorVisible = false;
    payerVisible = false;
    emsoInCorrectFormat = true;
    emsoIsANumber = true;

    nameChangedHandler(event){
        this.studentName = event.target.value;
    }
    surnameChangedHandler(event){
        this.studentSurname = event.target.value;
    }
    emsoChangedHandler(event){
        this.studentEmso = event.target.value;
    }
    birthdayChangedHandler(event){
        this.studentBirthday = event.target.value;
    }
    genderChangedHandler(event){
        this.studentGender = event.target.value;
    }
    addressChangedHandler(event){
        this.studentAddress = event.target.value;
    }
    typeChangedHandler(event){
        this.typeOfStudies = event.target.value;

        if(this.typeOfStudies=="Full time") {this.payerVisible = false;}
        else {this.payerVisible = true;}
    }
    methodChangedHandler(event){
        this.emsoCheckMethod = event.target.value;
    }
    payerChangedHandler(event) {
        this.payer = event.target.checked;
    }

    createStudent(){
        if(this.emsoCheckMethod == "API Call") {
            checkEmsoWithApi({emso : this.studentEmso})
            .then(response => {

                this.addStudent(response);
            })
        }
        else if(this.emsoCheckMethod == "Custom Method") {
            checkEmso({emso : this.studentEmso})
            .then(response => {

                this.addStudent(response)
            })
        }
    }

    addStudent(emsoResponse) {
        if(!emsoResponse) {
            this.emsoInCorrectFormat = false;
            this.successVisible = false;
        }
        else if(emsoResponse) {
            this.emsoIsANumber = true;
            // Creating mapping of fields of Account with values
            var fields = {'Name' : this.studentName, 
            'Surname__c' : this.studentSurname, 
            'EMSO__c' : this.studentEmso, 
            'StudyType__c' : this.typeOfStudies, 
            'Payer__c' : this.payer,
            'Gender__c' : this.studentGender,
            'Address__c' : this.studentAddress,
            'Birthday__c' : this.studentBirthday};

            // Record details to pass to create method with api name of Object.
            var objRecordInput = {'apiName' : 'Student__c', fields};
            // LDS method to create record.
            createRecord(objRecordInput).then(response => {
                console.log("success")
                this.successVisible = true
                this.errorVisible = false;
                this.emsoInCorrectFormat = true;
            }).catch(error => {
                console.log(error);
                this.successVisible = false
                this.errorVisible = true
            })
        }

    }
}

