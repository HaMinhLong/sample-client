const Config = require('./en-US/Config');
const UserGroup = require('./en-US/UserGroup');

module.exports = {
  'app.common.validate.max300':
    'Please enter the correct format up to 300 characters',
  'app.table.column.no': '#',
  'app.tooltip.remove': 'Delete',
  'app.tooltip.edit': 'Update',
  'app.title.export': 'Create news points',
  'app.title.create': 'Add {name}',
  'app.title.update': 'Update {name}',
  'app.confirm.remove': 'Are you sure you want to delete the record?',
  'app.confirm.reset': 'Definitely want to cancel?',
  'app.search.placeHolder': 'Search by name {functionName}',
  'app.search.label': 'Name {name}',
  'app.search.button': 'Search',
  'app.common.action': '#',
  'app.common.deleteBtn.cancelText': 'Cancel',
  'app.common.statusTag.-1': 'Delete',
  'app.common.statusTag.-2': 'Pending',
  'app.common.statusTag.1': 'Activated',
  'app.common.statusTag.0': 'Hide',
  'app.common.status.placeholder': 'Status search',
  'app.common.type.placeholder': 'Search {name}',
  'app.common.placeholder.dateCreated': 'Date created',
  'app.common.placeholder.rangepicker.0': 'Start day',
  'app.common.placeholder.rangepicker.1': 'End date',
  'app.common.crudBtns.0': 'Come back',
  'app.common.crudBtns.1': 'Refresh',
  'app.common.crudBtns.2': 'Save',
  'app.common.crudBtns.3': 'Export report',
  'app.common.searchBtn': 'Search',
  'app.common.delete.success': 'Delete record successfully!',
  'app.common.edit.success': 'Successfully updated!',
  'app.common.export.success': 'Export statistics {name} successfully!',
  'app.common.create.success': 'Add {name} successfully!',
  'app.common.error.server.msg': 'An error occurred!',
  'app.common.crud.error.update.change': 'Please change at least 1 field',
  'app.common.crud.validate.input': 'Please enter information',
  'app.common.crud.validate.select': 'Please select information',
  'app.common.crud.validate.fomatUnit':
    'Please enter between 1 and 50 characters including letters, numbers and starting with a letter',
  'app.common.crud.validate.fomatMedi':
    'Please enter between 3 and 50 characters including letters, numbers /-, and starting with a letter',
  'app.common.crud.validate.fomat':
    'Please enter between 3 and 50 characters including letters, numbers and starting with a letter',
  'app.common.crud.validate.fomatNew':
    'Please enter at least 3 characters including letters, numbers and starting with a letter',
  'app.common.crud.validate.formatName':
    'Please enter at least 3 characters including letters, numbers and unsigned special characters',
  'app.common.crud.validate.url': 'Please enter correct url format',
  'app.common.crud.validate.phone': 'Please enter correct phone number format',
  'app.common.crud.validate.email': 'Please enter correct email format',
  'app.common.crud.validate.phone_email':
    'Please enter the correct phone number or email format',
  'app.common.crud.validate.type':
    'Please enter the correct format {name} from 3 to 50 characters',
  'app.common.validate.max': 'Please enter up to {max} characters!',
  'app.common.changeStatus.success': 'Status update successful!',
  'app.common.validate.message': 'Please enter a message!',
  'app.common.validate.max200': 'Please enter up to 200 characters!',

  ...Config,
  ...UserGroup,
};
