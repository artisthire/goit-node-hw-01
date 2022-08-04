const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.resolve("./db/contacts.json");

// TODO: задокументировать каждую функцию
/**
 * Read and return all contacts
 * @returns {Array.<{id: String, name: String, email: String, phone: String}>} All contacts
 */
function listContacts() {
  return catchError(async () => {
    const contacts = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(contacts);
  });
}

/**
 * Return contact by Id
 * @param {number|string} contactId - id of contact
 * @returns {{id: String, name: String, email: String, phone: String}} All contacts
 */
async function getContactById(contactId) {
  if (!contactId) {
    throw new Error('Parameters "contactId" is required');
  }

  if (!(typeof contactId === "string" || typeof contactId === "number")) {
    throw new Error('Parameters "contactId" should be "string" or "number"');
  }

  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === String(contactId));
}

/**
 * Remove contact by Id and write result to database
 * @param {number|string} contactId - id of contact
 */
async function removeContact(contactId) {
  if (!contactId) {
    throw new Error('Parameters "contactId" is required');
  }

  if (!(typeof contactId === "string" || typeof contactId === "number")) {
    throw new Error('Parameters "contactId" should be "string" or "number"');
  }

  const contacts = await listContacts();
  const filteredContacts = contacts.filter(
    (contact) => contact.id !== String(contactId)
  );

  catchError(async () => {
    await fs.writeFile(contactsPath, JSON.stringify(filteredContacts), "utf-8");
  });
}

/**
 * Add contact to database
 * @param {string} name - contact name
 * @param {string} email - contact email
 * @param {string} phone - contact phone
 */
async function addContact(name, email, phone) {
  if (!name || !email || !phone) {
    throw new Error('Parameters "name", "email" and "phone" is required');
  }

  const contacts = await listContacts();
  const nextContactId = String(Number(contacts[contacts.length - 1].id) + 1);
  contacts.push({ id: nextContactId, name, email, phone });

  catchError(async () => {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, "\t"));
  });
}

async function catchError(func) {
  try {
    return await func();
  } catch (error) {
    console.log("Error message: ", error.message);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
