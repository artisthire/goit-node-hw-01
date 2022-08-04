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

function invokeAction({ action, id, name, email, phone }) {
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
        console.table(contact);
      });
      break;

    case "add":
      if (!name || !email || !phone) {
        console.error(
          '\x1B[31m Parameters "name", "email" and "phone" is required'
        );
        console.error(
          '\x1B[31m Use "-n, --name <name>", "-e, --email <email>", "-p, --phone <phone>"'
        );
        break;
      }

      catchError(async () => {
        await contactsApi.addContact(name, email, phone);
        console.log("\x1b[32m Contact added");
      });
      break;

    case "remove":
      if (!validateId(id)) {
        break;
      }

      catchError(async () => {
        await contactsApi.removeContact(id);
        console.log("\x1b[32m Contact removed");
      });
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

function validateId(id) {
  if (!id) {
    console.error('\x1B[31m Parameter "id" is required');
    console.error('\x1B[31m Use: "-i, --id <id>"');
    return false;
  }

  return true;
}

async function catchError(func) {
  try {
    return await func();
  } catch (error) {
    console.warn(`\x1B[31m ${error.message}`);
  }
}

invokeAction(argv);
