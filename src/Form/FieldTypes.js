import FieldCheckboxMultiple from './FieldCheckboxMultiple';
import FieldInput from './FieldInput';
import FieldPassword from './FieldPassword';
import FieldTextarea from './FieldTextarea';

const FieldTypes = {
  'checkboxMultiple': FieldCheckboxMultiple,
  'password': FieldPassword,
  'text': FieldInput,
  'textarea': FieldTextarea
};

module.exports = FieldTypes;
