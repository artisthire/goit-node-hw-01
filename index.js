const contactsApi = require("./contacts");

// contactsApi.removeContact(10).then(console.log).catch(console.log);
contactsApi
  .addContact("Alex", "aa@ua.ua", "333-333-333")
  .then(console.log)
  .catch(console.log);

setTimeout(
  () => contactsApi.listContacts().then(console.log).catch(console.log),
  2000
);
