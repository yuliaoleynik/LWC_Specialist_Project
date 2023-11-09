import { LightningElement, api} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';

export default class BoatReviews extends NavigationMixin(LightningElement) 
{    
    boatId;
    error;
    boatReviews;
    isLoading = false;
    
    get recordId() 
    { 
        return this.boatId;
    }
    @api
    set recordId(value) 
    {
        this.setAttribute('boatId', value);
        this.boatId = value;
        this.getReviews();
    }
    
    // Getter to determine if there are reviews to display
    get reviewsToShow() 
    { 
        return this.boatReviews !== undefined && this.boatReviews !== null && this.boatReviews.length > 0;
    }
    
    @api
    refresh() 
    { 
        this.getReviews();
    }
    
    // Imperative Apex call to get reviews for given boat
    getReviews() 
    {
        if(this.boatId)
        {
            this.isLoading = true;
            getAllReviews({boatId: this.boatId})
                .then(reviews => {
                    this.boatReviews = reviews;
                    this.error = undefined;
                })
                .catch(error => {
                    this.error = error;
                })
                .finally(() => {
                    this.isLoading = false;
                });
        }
        else 
        {
            return;
        }
    }
    
    // Helper method to use NavigationMixin to navigate to a given record on click
    navigateToRecord(event) 
    {
        event.preventDefault();
        event.stopPropagation();

        let recordId = event.target.dataset.recordId;

        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'User',
                actionName: 'view'
            }
        });
    }
  }