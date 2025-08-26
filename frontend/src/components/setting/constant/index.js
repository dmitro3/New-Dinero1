export const TAB_CONTROLS = [
  { label: 'Verify Profile', value: 'profile' },
  { label: 'Email', value: 'email' },
  // { label: 'Two Factor', value: 'twoFactor' },
  { label: 'Password', value: 'password' },
  { label: 'Avatar', value: 'avatar' },
  // { label: 'Preferences', value: 'preferences' },
  // { label: 'Ignored Users', value: 'ignoredUsers' },
  //   { label: 'Verify', value: 'verify' },
  { label: 'Bonus Drop', value: 'bonusDrop' },
  { label: 'Document Verification', value: 'verify' },
  { label: 'Self Exclusion', value: 'responsibleGambling' },
];

export const BASIC_INFO_FORM_CONTROLS = [
  {
    name: 'username',
    label: 'User Name',
    type: 'input',
    placeholder: 'Enter Username',
    required: 'This field is required',
  },
  {
    name: 'firstName',
    label: 'First Name',
    type: 'input',
    placeholder: 'First Name',
    isRequired: true,
    required: 'This field is required',
    validate: (value) => {
      if (
        !/^[A-Za-z]+(?: [A-Za-z]+)$/.test(value) &&
        !/^[A-Za-z]+$/.test(value)
      ) {
        return 'Only alphabets are allowed';
      }
      if (value.length > 40) {
        return 'Maximum 40 characters allowed';
      }
      if (value.length < 3) {
        return 'Minimum 3 characters needed';
      }
      // return true;
    },
  },
  {
    name: 'lastName',
    label: 'Last Name',
    type: 'input',
    placeholder: 'Last name',
    required: 'This field is required',
    validate: (value) => {
      if (!/^[a-zA-Z]+$/.test(value)) {
        return 'Only alphabets are allowed';
      }
      if (value.length > 40) {
        return 'Maximum 40 characters allowed';
      }
      if (value.length < 3) {
        return 'Minimum 3 characters needed';
      }
    },
    isRequired: true,
    // width: '300px',
  },
  {
    name: 'dateOfBirth',
    label: 'Date of Birth',
    type: 'date',
    placeholder: 'Date of Birth',
    required: 'This field is required',
    // width: '400px',
  },
  {
    name: 'zip',
    label: 'ZipCode',
    type: 'input',
    placeholder: 'Enter Zipcode',
    required: 'This field is required',
    pattern: {
      value: /^[0-9]{5}$/,
      message: 'Zipcode must be a 5 digit number',
    },
  },
  {
    name: 'city',
    label: 'City',
    type: 'input',
    placeholder: 'Enter City',
    required: 'This field is required',
    isRequired: true,
    validate: (value) => {
      const trimmed = value.trim();
      if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(trimmed)) {
        return 'Only alphabets with single spaces between words are allowed';
      }
      if (trimmed.length < 2) {
        return 'Minimum 2 characters required';
      }
      if (trimmed.length > 40) {
        return 'Maximum 40 characters allowed';
      }
    },
  },
  {
    name: 'address',
    label: 'Address',
    type: 'input',
    placeholder: 'Enter Address',
    required: 'This field is required',
    validate: (value) => {
      const trimmed = value.trim();
      if (!/^[A-Za-z0-9\s]+$/.test(trimmed)) {
        return 'Only letters, numbers, and spaces are allowed';
      }
      if (trimmed.length > 100) {
        return 'Maximum 100 characters allowed';
      }
      if (trimmed.length < 5) {
        return 'Minimum 5 characters needed';
      }
    },
    // width: '400px',
  }
  ,

  // {
  //   name: 'country',
  //   label: 'Country',
  //   type: 'select',
  //   placeholder: 'Country',
  //   // required: 'This field is required',
  //   // width: '300px',
  //   options: [
  //     { label: 'India', value: 'india' },
  //     { label: 'United States', value: 'united states' },
  //     { label: 'Canada', value: 'canada' },
  //   ],
  // },
    {
    name: 'stateCode',
    label: 'State',
    type: 'select',
    placeholder: 'Select State',
    required: 'This field is required',
    isRequired: true,
  },
];

export const KYC_STATUS = {
  approved: 'approved',
  resubmission_requested: 'resubmission_requested',
  declined: 'declined',
  expired: 'expired',
  abandoned: 'rbandoned',
  review: 'review',
  requested: 'requested',
};
