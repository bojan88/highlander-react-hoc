import React, { forwardRef } from 'react';

const TestComponent = forwardRef(({ ind }: any, ref: any) => (
  <div ref={ref}>component {ind}</div>
));

export default TestComponent;
