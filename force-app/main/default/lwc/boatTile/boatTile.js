import { LightningElement, api } from 'lwc';

const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
const TILE_WRAPPER_UNSELECTED_CLASS = 'tile-wrapper';

export default class BoatTile extends LightningElement 
{
    @api boat;
    @api selectedBoatId;
    
    get backgroundStyle()
    {
        return 'background-image:url('+ this.boat.Picture__c +')';
    }

    get tileClass()
    {
        if(this.boat.Id == this.selectedBoatID)
        {
            return TILE_WRAPPER_SELECTED_CLASS;
        }
        return TILE_WRAPPER_UNSELECTED_CLASS;
    }

    selectBoat()
    {
        this.selectedBoatId = this.boat.Id;
        const selectingEvent = new CustomEvent('boatselect', {
            detail: {
                boatId: this.selectedBoatId
            }
        })
        this.dispatchEvent(selectingEvent);
    }
}