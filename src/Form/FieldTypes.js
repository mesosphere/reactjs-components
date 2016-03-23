import FieldCheckbox from './FieldCheckbox';
import FieldCheckboxMultiple from './FieldCheckboxMultiple';
import FieldInput from './FieldInput';
import FieldPassword from './FieldPassword';
import FieldSubmit from './FieldSubmit';
import FieldTextarea from './FieldTextarea';

const FieldTypes = {
  'checkbox': FieldCheckbox,
  'checkboxMultiple': FieldCheckboxMultiple,
  'password': FieldPassword,
  'submit': FieldSubmit,
  'text': FieldInput,
  'textarea': FieldTextarea
};

module.exports = FieldTypes;
