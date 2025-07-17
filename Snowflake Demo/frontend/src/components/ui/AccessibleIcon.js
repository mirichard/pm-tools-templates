// src/components/ui/AccessibleIcon.js
import React from 'react';

const AccessibleIcon = ({ label, children, decorative = false }) => {
  const props = {};
  if (decorative) {
    props['aria-hidden'] = true;
  } else {
    props.role = 'img';
    props['aria-label'] = label;
  }
  return React.cloneElement(children, props);
};

export default AccessibleIcon;

