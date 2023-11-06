import { LightningElement, api, wire, track } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';

const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT = 'Ship it!';
const SUCCESS_VARIANT = 'success';
const ERROR_TITLE = 'Error';
const ERROR_VARIANT = 'error';

const columns = [
  { label: 'Name', fieldName: 'Name', type: 'text', editable: true },
  { label: 'Length', fieldName: 'Length__c', type: 'number', editable: true},
  { label: 'Price', fieldName: 'Price__c', type: 'currency', editable: true, typeAttributes: { currencyCode: 'USD' }},
  { label: 'Description', fieldName: 'Description__c', type: 'text', editable: true}
];

export default class BoatSearchResults extends LightningElement 
{
  @api selectedBoatId;
  @track boats;
  @track draftValues = [];

  columns = columns;
  boatTypeId = '';
  isLoading = false;
  
  @wire(MessageContext)
  messageContext;
  
  @wire(getBoats, {boatTypeID: '$boatTypeId'})
  wiredBoats({data, error}) 
  {
    if(data)
    {
      this.boats = data;
    }
    else if(error)
    {
      console.log(error);
    }
  }
  
  // updates the existing boatTypeId property
  @api
  searchBoats(boatTypeId) 
  { 
    this.isLoading = true;
    this.notifyLoading(this.isLoading);
    this.boatTypeId = boatTypeId;
  }
  
  // refresh the boats asynchronously
  @api
  async refresh() 
  { 
    this.isLoading = true;
    this.notifyLoading(this.isLoading);

    await refreshApex(this.boats);

    this.isLoading = false;
    this.notifyLoading(this.isLoading);
  }
  
  updateSelectedTile(event) 
  { 
    this.selectedBoatId = event.detail.boatId;
    this.sendMessageService(this.selectedBoatId);
  }
  
  sendMessageService(boatId) 
  { 
    publish(this.messageContext, BOATMC, {recordId: boatId});
  }
  
  // save the changes in the Boat Editor
  // passing the updated fields from draftValues to the 
  // Apex method updateBoatList(Object data).
  handleSave(event) 
  {
    const updatedFields = event.detail.draftValues;
    
    updateBoatList({data: updatedFields})
    .then(result => {
          const toast = new ShowToastEvent({
                        title: SUCCESS_TITLE,
                        message: MESSAGE_SHIP_IT,
                        variant: SUCCESS_VARIANT,
            });
          this.dispatchEvent(toast);
          this.draftValues = [];
          return this.refresh();
    })
    .catch(error => {
          const toast = new ShowToastEvent({
                        title: ERROR_TITLE,
                        message: error.message,
                        variant: ERROR_VARIANT,
          });
          this.dispatchEvent(toast); 
    })
    .finally(() => {});
  }

  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) 
  {
    if(isLoading)
    {
      this.dispatchEvent(new CustomEvent('loading'));
    }
    else
    {
      this.dispatchEvent(new CustomEvent('doneloading'));
    }
  }
}