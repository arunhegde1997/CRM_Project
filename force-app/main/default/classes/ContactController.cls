public with sharing class ContactController {

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts() {
        return [SELECT Id, Name, Email, Phone FROM Contact LIMIT 50];
    }

    @AuraEnabled
    public static void createContact(String name, String email, String phone) {

        List<Account> accList = [SELECT Id FROM Account WHERE Name = 'Default Account' LIMIT 1];

        Account acc;

        if(accList.isEmpty()){
            acc = new Account(Name = 'Default Account');
            insert acc;
        } else {
            acc = accList[0];
        }

        Contact c = new Contact(
            LastName = name,
            Email = email,
            Phone = phone,
            AccountId = acc.Id
        );

        insert c;
    }

    @AuraEnabled
    public static void updateContacts(List<Contact> contactList) {
        update contactList;
    }

    @AuraEnabled
    public static void deleteContact(Id contactId) {
        delete [SELECT Id FROM Contact WHERE Id = :contactId];
    }
}