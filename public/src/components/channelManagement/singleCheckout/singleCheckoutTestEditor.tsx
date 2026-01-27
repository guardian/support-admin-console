import React from 'react';
import { ValidatedTestEditorProps } from '../validatedTestEditor';
import { SingleCheckoutTest } from '../../../models/singleCheckout';

const SingleCheckoutTestEditor: React.FC<ValidatedTestEditorProps<SingleCheckoutTest>> = ({
  test,
}: ValidatedTestEditorProps<SingleCheckoutTest>) => {
  if (!test) {
    return null;
  }

  return <div>Single Checkout Test Editor Placeholder</div>;
};

export default SingleCheckoutTestEditor;
