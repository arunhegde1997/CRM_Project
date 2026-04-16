import { LightningElement, track } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import createContact from '@salesforce/apex/ContactController.createContact';
import updateContacts from '@salesforce/apex/ContactController.updateContacts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const columns = [
    { label: 'Name', fieldName: 'Name', editable: true },
    { label: 'Email', fieldName: 'Email', editable: true },
    { label: 'Phone', fieldName: 'Phone', editable: true }
];

export default class ContactManager extends LightningElement {

    @track contacts = [];
    @track filteredContacts = [];
    columns = columns;
    draftValues = [];

    name = '';
    email = '';
    phone = '';

    connectedCallback() {
        this.loadContacts();
    }

    loadContacts() {
        getContacts().then(result => {
            this.contacts = result;
            this.filteredContacts = result;
        });
    }

    handleSearch(event) {
        const searchKey = event.target.value.toLowerCase();

        this.filteredContacts = this.contacts.filter(con =>
            con.Name.toLowerCase().includes(searchKey)
        );
    }

    handleName(e) { this.name = e.target.value; }
    handleEmail(e) { this.email = e.target.value; }
    handlePhone(e) { this.phone = e.target.value; }

    addContact() {
        if (!this.name) {
            this.showToast('Error', 'Name is required', 'error');
            return;
        }

        createContact({ name: this.name, email: this.email, phone: this.phone })
            .then(() => {
                this.showToast('Success', 'Contact Added', 'success');
                this.loadContacts();
            });
    }

    handleSave(event) {
        const updatedFields = event.detail.draftValues;

        updateContacts({ contactList: updatedFields })
            .then(() => {
                this.showToast('Success', 'Updated Successfully', 'success');
                this.draftValues = [];
                this.loadContacts();
            });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({
            title, message, variant
        }));
    }
}