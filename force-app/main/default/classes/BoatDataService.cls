public with sharing class BoatDataService 
{
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
    public static List<Boat__c> getBoats(String boatTypeID, String keyWord)
    {
        String searchWord = keyWord + '%';
        try 
        {
           String query = 'SELECT ' 
                        + 'Name, Description__c, Geolocation__Latitude__s, '
                        + 'Geolocation__Longitude__s, Picture__c, Contact__r.Name, '
                        + 'BoatType__c, BoatType__r.Name, Length__c, Price__c '
                        + 'FROM Boat__c';

            if(String.isNotBlank(boatTypeID) && String.isNotBlank(keyWord))
            {
                query += ' WHERE Name LIKE :searchWord AND BoatType__c = :boatTypeID';
                return Database.query(query);
            }
            else if(String.isNotBlank(boatTypeID))
            {
                query += ' WHERE BoatType__c = :boatTypeID';
            }
            else if(String.isNotBlank(keyWord))
            {
                query += ' WHERE Name LIKE :searchWord';
            }
            
            return Database.query(query);
        } 
        catch (Exception e) 
        {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Boat__c> getSimilarBoats(Id boatId, String similarBy)
    {
        try 
        {
            List<Boat__c> relatedBoats = new List<Boat__c>();
            List<Boat__c> parentBoat = [SELECT Id, Length__c, Price__c, BoatType__c, BoatType__r.Name
                                    FROM Boat__c
                                    WHERE Id = :boatId 
                                    WITH SECURITY_ENFORCED];
            if (parentBoat.isEmpty()) 
            {
                return relatedBoats;
            }
            if (similarBy == 'Length') 
            {
                relatedBoats = [
                    SELECT Id, Contact__r.Name, Name, BoatType__c,
                            BoatType__r.Name, Length__c, Picture__c, Price__c, Year_Built__c
                    FROM Boat__c
                    WHERE Id != :parentBoat.get(0).Id
                    AND (Length__c >= :parentBoat.get(0).Length__c / 1.2)
                    AND (Length__c <= :parentBoat.get(0).Length__c * 1.2)
                    WITH SECURITY_ENFORCED
                    ORDER BY Length__c, Price__c, Year_Built__c
                ];
            } else if (similarBy == 'Price') 
            {
                relatedBoats = [
                    SELECT Id, Contact__r.Name, Name, BoatType__c,
                            BoatType__r.Name, Length__c, Picture__c, Price__c, Year_Built__c
                    FROM Boat__c
                    WHERE Id != :parentBoat.get(0).Id
                    AND (Price__c >= :parentBoat.get(0).Price__c / 1.2)
                    AND (Price__c <= :parentBoat.get(0).Price__c * 1.2)
                    WITH SECURITY_ENFORCED
                    ORDER BY Price__c, Length__c, Year_Built__c
                ];
            } else if (similarBy == 'Type') 
            {
                relatedBoats = [
                    SELECT Id, Contact__r.Name, Name, BoatType__c,
                            BoatType__r.Name, Length__c, Picture__c, Price__c, Year_Built__c
                    FROM Boat__c
                    WHERE Id != :parentBoat.get(0).Id
                    AND (BoatType__c = :parentBoat.get(0).BoatType__c)
                    WITH SECURITY_ENFORCED
                    ORDER BY Price__c, Length__c, Year_Built__c
                ];
            }
            return relatedBoats;
        } 
        catch (Exception e) 
        {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<BoatReview__c> getAllReviews(Id boatId)
    {
        try 
        {
            return [SELECT Id, Name, Comment__c, Rating__c,
                    LastModifiedDate, CreatedDate, CreatedBy.Name,
                    CreatedBy.SmallPhotoUrl, CreatedBy.CompanyName
                    FROM BoatReview__c
                    WHERE Boat__c =: boatId
                    WITH SECURITY_ENFORCED
                    ORDER BY CreatedDate DESC];
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