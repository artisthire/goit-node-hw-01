const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.resolve("./db/contacts.json");

/**
 * Returns a list of all contacts from the database
 * @returns {Array.<{id: String, name: String, email: String, phone: String}>} all contacts
 */
async function listContacts() {
  const contacts = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(contacts);
}

/**
 * Returns a contact from the database by id
 * @param {string} contactId - contact's id
 * @returns {{id: String, name: String, email: String, phone: String}} selected contact
 */
async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === contactId);

  return contact || null;
}

/**
 * Removes a contact from the database by id
 * @param {string} contactId - contact's id
 */
async function removeContact(contactId) {
  const contacts = await listContacts();
  const idx = contacts.findIndex((contact) => contact.id === contactId);

  if (idx === -1) {
    return null;
  }

  const [contact] = contacts.splice(idx, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf-8");

  return contact;
}

/**
 * Adds a new contact to the database
 * @param {string} name - contact's name
 * @param {string} email - contact's email
 * @param {string} phone - contact's phone
 */
async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const nextContactId = Number(contacts[contacts.length - 1].id) + 1;
  const newContact = { id: `${nextContactId}`, name, email, phone };
  contacts.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return newContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
