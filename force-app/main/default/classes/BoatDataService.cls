public with sharing class BoatDataService {
    
    @AuraEnabled(cacheable=true)
    public static List<BoatType__c> getBoatTypes() 
    {
        try
        {
            return [SELECT Id, Name FROM BoatType__c WITH SECURITY_ENFORCED];
        }
        catch(Exception e)
        {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Boat__c> getBoats(String boatTypeID){
        try 
        {
           String query = 'SELECT ' 
                        + 'Name, Description__c, Geolocation__Latitude__s, '
                        + 'Geolocation__Longitude__s, Picture__c, Contact__r.Name, '
                        + 'BoatType__c, BoatType__r.Name, Length__c, Price__c '
                        + 'FROM Boat__c';
            if(String.isNotBlank(boatTypeID))
            {
                query += ' WHERE BoatType__c = :boatTypeID';
            }
            return Database.query(query);
        } 
        catch (Exception e) 
        {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Boat__c> getSimilarBoats(Id boatId, String similarBy){
        try 
        {
            return [SELECT Id, Name FROM Boat__c  WITH SECURITY_ENFORCED];
        } 
        catch (Exception e) 
        {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=false)
    public static List<BoatReview__c> getAllReviews(Id boatId){
        try 
        {
            return [SELECT Id, Name FROM BoatReview__c  WITH SECURITY_ENFORCED];
        } 
        catch (Exception e) 
        {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static String getBoatsByLocation(Decimal latitude, Decimal longitude, String boatTypeId)
    {
        String query = 'SELECT Name, Geolocation__Latitude__s, Geolocation__Longitude__s FROM Boat__c ';
        if(String.isNotBlank(boatTypeId))
        {
            query += 'WHERE BoatType__c = :boatTypeId ';
        }
        query += ' WITH SECURITY_ENFORCED ORDER BY DISTANCE(Geolocation__c, GEOLOCATION(:latitude, :longitude), \'mi\') LIMIT 10';
        return JSON.serialize(Database.query(query));
    }

    @AuraEnabled
    public static String updateBoatList(Object data)
    {
        List<Boat__c> updateBoats = (List<Boat__c>) JSON.deserialize(
            JSON.serialize(data),
            List<Boat__c>.class            
        );

        update updateBoats;
        return 'Success: Boats updated successfully';
    }
}