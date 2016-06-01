## Unversioned

### Added

- #180 – Adds ability to render disabled checkbox.
- #260 - Add FieldSelect component
- #257 - Added support for focus for input fields with type "text" in the Form component

### Changed

- #180 – Moved FieldCheckbox to FieldCheckboxMultiple, and created a new FieldCheckbox that only renders one checkbox.
- #275 - Pass through all data on change in Form FieldSelect

### Fixed

## 0.14.0 – 01/22/2016

### Changed

- #171 – Updated React to 0.14. React is along with other dependencies are now required as peerDependencies.
- #261 - Added Radio Button component to the Form component.
- #262 – Change Checkbox component to extend Radio Button component and reuse functionality. Functionality of FieldCheckbox and FieldCheckboxMultiple is now both contained in FieldCheckbox.
- #276 - Change Form updating to delete fields that are no longer part of the definition.
