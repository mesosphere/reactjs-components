import FieldCheckbox from './FieldCheckbox';
import FieldInput from './FieldInput';
import FieldPassword from './FieldPassword';
import FieldTextarea from './FieldTextarea';

const FieldTypes = {
  'checkbox': FieldCheckbox,
  'password': FieldPassword,
  'text': FieldInput,
  'textarea': FieldTextarea
};

module.exports = FieldTypes;
