const { Command } = require("commander");
const contactsApi = require("./contacts");

const program = new Command();
program
  .option("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

program.parse(process.argv);

const argv = program.opts();

/**
 * Performs operations on the contacts database.
 * The type of operation is determined by the "action" parameter.
 * @param {string} action - action type
 * @param {string} id - contact id
 * @param {string} name - contact name
 * @param {string} email - contact email
 * @param {string} phone - contact phone
 */
async function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      catchError(async () => {
        const contacts = await contactsApi.listContacts();
        console.table(contacts);
      });
      break;

    case "get":
      if (!validateId(id)) {
        break;
      }

      catchError(async () => {
        const contact = await contactsApi.getContactById(id);

        if (contact) {
          console.table(contact);
        } else {
          console.error(`\x1B[31m Contact with id ${id} not found`);
        }
      });

      break;

    case "add":
      if (!name || !email || !phone) {
        console.error(
          `\x1B[31m Parameters "name", "email" and "phone" is required\n
          Use "-n, --name <name>", "-e, --email <email>", "-p, --phone <phone>"`
        );
        break;
      }

      catchError(async () => {
        const contact = await contactsApi.addContact(name, email, phone);
        console.log("\x1b[32m Contact added");
        console.table(contact);
      });

      break;

    case "remove":
      if (!validateId(id)) {
        break;
      }

      catchError(async () => {
        const contact = await contactsApi.removeContact(id);

        if (contact) {
          console.log("\x1b[32m Contact removed");
        } else {
          console.error(`\x1B[31m Contact id ${id} not found`);
        }
      });

      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

/**
 * Performs "id" parameter validation.
 * @param {string} id - contact id
 * @returns {boolean} - true - validation OK
 */
function validateId(id) {
  if (!id) {
    console.error('\x1B[31m Parameter "id" is required\nUse: "-i, --id <id>"');
    return false;
  }

  return true;
}

/**
 * Wraps an asynchronous function in a try catch block.
 * Returns the result of the function in case of success, otherwise logs an error to the console.
 * @param {function} func - asynchronous function
 * @returns {any} - result of functions calls
 */
async function catchError(func) {
  try {
    return await func();
  } catch (error) {
    console.warn(`\x1B[31m ${error.message}`);
  }
}

invokeAction(argv);
