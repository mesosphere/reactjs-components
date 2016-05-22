import FieldCheckbox from './FieldCheckbox';
import FieldInput from './FieldInput';
import FieldPassword from './FieldPassword';
import FieldRadioButton from './FieldRadioButton';
import FieldSelect from './FieldSelect';
import FieldSubmit from './FieldSubmit';
import FieldTextarea from './FieldTextarea';

const FieldTypes = {
  'checkbox': FieldCheckbox,
  'number': FieldInput,
  'password': FieldPassword,
  'radioButton': FieldRadioButton,
  'submit': FieldSubmit,
  'text': FieldInput,
  'textarea': FieldTextarea,
  'select': FieldSelect
};

module.exports = FieldTypes;
