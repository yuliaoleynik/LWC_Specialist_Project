import { LightningElement, api, wire } from "lwc";
import { MessageContext, subscribe, APPLICATION_SCOPE } from "lightning/messageService";
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import { getRecord } from "lightning/uiRecordApi";

const LONGITUDE_FIELD = "Boat__c.Geolocation__Longitude__s";
const LATITUDE_FIELD = "Boat__c.Geolocation__Latitude__s";
const BOAT_FIELDS = [LONGITUDE_FIELD, LATITUDE_FIELD];

<<<<<<< HEAD
export default class BoatMap extends LightningElement {

  subscription = null;
  boatId;

  @api
  get recordId() {
    return this.boatId;
  }
  set recordId(value) {
=======
export default class BoatMap extends LightningElement 
{

  subscription = null;
  boatId;
  error = undefined;
  mapMarkers = [];

  @api
  get recordId() 
  {
    return this.boatId;
  }
  set recordId(value) 
  {
>>>>>>> 8cff279d84967a81e0dca370003b8b21352889e4
    this.setAttribute('boatId', value);
    this.boatId = value;
  }

<<<<<<< HEAD
  error = undefined;
  mapMarkers = [];

=======
>>>>>>> 8cff279d84967a81e0dca370003b8b21352889e4
  @wire(MessageContext)
  messageContext;

  @wire(getRecord, {recordId: '$boatId', fields: BOAT_FIELDS})
  wiredRecord({ error, data }) 
  {
<<<<<<< HEAD
    if (data) {
=======
    if (data) 
    {
>>>>>>> 8cff279d84967a81e0dca370003b8b21352889e4
      this.error = undefined;
      const longitude = data.fields.Geolocation__Longitude__s.value;
      const latitude = data.fields.Geolocation__Latitude__s.value;
      this.updateMap(longitude, latitude);
<<<<<<< HEAD
    } else if (error) {
=======
    } else if (error) 
    {
>>>>>>> 8cff279d84967a81e0dca370003b8b21352889e4
      this.error = error;
      this.boatId = undefined;
      this.mapMarkers = [];
    }
  }

  subscribeMC() 
  {
<<<<<<< HEAD
    if (this.subscription || this.recordId) {
=======
    if (this.subscription || this.recordId) 
    {
>>>>>>> 8cff279d84967a81e0dca370003b8b21352889e4
      return;
    }
    this.subscription = subscribe(
      this.messageContext,
      BOATMC,
      (message) => { this.boatId = message.recordId },
      { scope: APPLICATION_SCOPE }
    );
  }

  connectedCallback() 
  {
    this.subscribeMC();
  }

  updateMap(Longitude, Latitude) 
  {
    this.mapMarkers = [{
        location: { Latitude, Longitude }}];
  }

<<<<<<< HEAD
  get showMap() {
=======
  get showMap() 
  {
>>>>>>> 8cff279d84967a81e0dca370003b8b21352889e4
    return this.mapMarkers.length > 0;
  }
}