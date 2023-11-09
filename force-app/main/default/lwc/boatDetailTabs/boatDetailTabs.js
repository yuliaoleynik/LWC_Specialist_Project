import { LightningElement, wire } from 'lwc';
import { MessageContext, subscribe, APPLICATION_SCOPE } from 'lightning/messageService';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';

import labelDetails from '@salesforce/label/c.Details';
import labelReviews from '@salesforce/label/c.Reviews';
import labelAddReview from '@salesforce/label/c.Add_Review';
import labelFullDetails from '@salesforce/label/c.Full_Details';
import labelPleaseSelectABoat from '@salesforce/label/c.Please_select_a_boat';
 
import BOAT_ID_FIELD from '@salesforce/schema/Boat__c.Id';
import BOAT_NAME_FIELD from '@salesforce/schema/Boat__c.Name';
const BOAT_FIELDS = [BOAT_ID_FIELD, BOAT_NAME_FIELD];

import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

export default class BoatDetailTabs extends NavigationMixin(LightningElement) 
{
  boatId;
  subscription = null;
  label = {
    labelDetails,
    labelReviews,
    labelAddReview,
    labelFullDetails,
    labelPleaseSelectABoat,
  };

  @wire(getRecord, { recordId: '$boatId', fields: BOAT_FIELDS })
  wiredRecord;

  @wire(MessageContext)
  messageContext;
  
  // Decide when to show or hide the icon
  get detailsTabIconName() 
  { 
    if(this.wiredRecord.data)
    {
      return 'utility:anchor';
    }
    return null;
  }

  get boatName() 
  { 
    return getFieldValue(this.wiredRecord.data, BOAT_NAME_FIELD);
  }

  // Subscribe to the message channel
  subscribeMC() 
  {
    if(!this.subscription)
    {
      this.subscription = subscribe(
        this.messageContext,
        BOATMC,
        (message) => { this.boatId = message.recordId },
        { scope: APPLICATION_SCOPE }
      );
    }  
  }
  
  connectedCallback() 
  {
    this.subscribeMC();
  }
  
  navigateToRecordViewPage() 
  { 
    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
        recordId: this.boatId,
        objectApiName: 'Boat__c',
        actionName: 'view'
      },
    });
  }
  
  // Navigates back to the review list, and refreshes reviews component
  handleReviewCreated() 
  { 
    this.template.querySelector('lightning-tabset').activeTabValue = 'reviews';
    this.template.querySelector('c-boat-reviews').refresh();
  }
}