const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.resolve("./db/contacts.json");

/**
 * Read and return all contacts
 * @returns {Array.<{id: String, name: String, email: String, phone: String}>} All contacts
 */
async function listContacts() {
  const contacts = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(contacts);
}

/**
 * Return contact by Id
 * @param {number|string} contactId - id of contact
 * @returns {{id: String, name: String, email: String, phone: String}} All contacts
 */
async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === contactId);

  if (!contact) {
    throw new Error(`Contact with id ${contactId} not found`);
  }

  return contact;
}

/**
 * Remove contact by Id and write result to database
 * @param {number|string} contactId - id of contact
 */
async function removeContact(contactId) {
  const contacts = await listContacts();
  const filteredContacts = contacts.filter(
    (contact) => contact.id !== contactId
  );

  if (contacts.length === filteredContacts.length) {
    throw new Error(`Contact id ${contactId} not found`);
  }

  await fs.writeFile(contactsPath, JSON.stringify(filteredContacts), "utf-8");
}

/**
 * Add contact to database
 * @param {string} name - contact name
 * @param {string} email - contact email
 * @param {string} phone - contact phone
 */
async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const nextContactId = Number(contacts[contacts.length - 1].id) + 1;
  contacts.push({ id: `${nextContactId}`, name, email, phone });

  await fs.writeFile(contactsPath, JSON.stringify(contacts));
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
