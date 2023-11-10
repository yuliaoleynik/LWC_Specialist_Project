import { LightningElement, api, wire } from "lwc";
import getSimilarBoats from "@salesforce/apex/BoatDataService.getSimilarBoats";
import {NavigationMixin} from 'lightning/navigation';

export default class SimilarBoats extends NavigationMixin(LightningElement) 
{
    @api similarBy;
    relatedBoats;
    boatId;
    error;
    
    @api
    get recordId() 
    {
        return this.boatId;
    }
    set recordId(value) 
    {
        this.setAttribute('boatId', value);
        this.boatId = value;
    }

    get getTitle() 
    {
        return 'Similar boats by ' + this.similarBy;
    }
    get noBoats() 
    {
        return !(this.relatedBoats && this.relatedBoats.length > 0);
    }
    
    @wire(getSimilarBoats, {boatId: '$boatId', similarBy: '$similarBy'})
    similarBoats({ error, data }) 
    { 
        if(data)
        {
            this.relatedBoats = data;
            this.error = undefined;
        }
        else if(error)
        {
            this.error = error;
        }
    }
    
    
    openBoatDetailPage(event) 
    { 
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.detail.boatId,
                objectApiName: 'Boat__c',
                actionName: 'view'
            },
        });
    }
}