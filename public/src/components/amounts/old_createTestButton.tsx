// import React from 'react';
// import { Button, makeStyles, Typography } from '@material-ui/core';
// import AddIcon from '@material-ui/icons/Add';
// import CreateTestDiaglog from './createTestDialog';
// import useOpenable from '../../hooks/useOpenable';

// const useStyles = makeStyles(() => ({
//   button: {
//     justifyContent: 'start',
//     height: '48px',
//   },
//   text: {
//     fontSize: '12px',
//     fontWeight: 500,
//     textTransform: 'uppercase',
//     letterSpacing: '1px',
//   },
// }));

// interface CreateTestButtonProps {
//   onCreate: (name: string) => void;
//   existingNames: string[];
// }

// const CreateTestButton: React.FC<CreateTestButtonProps> = ({
//   onCreate,
//   existingNames,
// }: CreateTestButtonProps) => {
//   const [isOpen, open, close] = useOpenable();

//   const classes = useStyles();
//   return (
//     <>
//       <Button
//         variant="contained"
//         color="primary"
//         className={classes.button}
//         startIcon={<AddIcon />}
//         onClick={open}
//       >
//         <Typography className={classes.text}>Create a new test</Typography>
//       </Button>
//       <CreateTestDiaglog
//         isOpen={isOpen}
//         close={close}
//         existingNames={existingNames}
//         createTest={onCreate}
//       />
//     </>
//   );
// };

// export default CreateTestButton;
