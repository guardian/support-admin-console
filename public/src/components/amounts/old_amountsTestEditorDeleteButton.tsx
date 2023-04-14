// import React, { useState } from 'react';
// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   IconButton,
// } from '@material-ui/core';
// import DeleteIcon from '@material-ui/icons/Delete';

// interface AmountsTestEditorDeleteButtonProps {
//   onDelete: () => void;
// }

// const AmountsTestEditorDeleteButton: React.FC<AmountsTestEditorDeleteButtonProps> = ({
//   onDelete,
// }: AmountsTestEditorDeleteButtonProps) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const open = (): void => setIsOpen(true);
//   const close = (): void => setIsOpen(false);

//   const submit = (): void => {
//     onDelete();
//     close();
//   };

//   return (
//     <>
//       <IconButton onClick={open}>
//         <DeleteIcon />
//       </IconButton>
//       <Dialog
//         open={isOpen}
//         onClose={close}
//         aria-labelledby="delete-test-dialog-title"
//         aria-describedby="delete-test-dialog-description"
//       >
//         <DialogTitle id="delete-test-dialog-title">Are you sure?</DialogTitle>
//         <DialogContent>
//           <DialogContentText id="delete-test-dialog-description">
//             Deleting this test will remove it from the amounts tool permanently.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button color="primary" onClick={close}>
//             Cancel
//           </Button>
//           <Button color="primary" onClick={submit}>
//             Delete test
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default AmountsTestEditorDeleteButton;
