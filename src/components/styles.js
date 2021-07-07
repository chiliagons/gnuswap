import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    '& > .fa': {
      margin: theme.spacing(2),
    },
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  button:{
    backgroundColor:'#008c73',
    display:'flex',
    borderRadius:'8px',
    textTransform: 'capitalize',
    alignContent:'center',
    flexDirection: 'row',    
    justifyContent: 'center',


  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    color:'#008c73',
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
  card:{
    display: 'flex',
    alignContent:'center',
    flexDirection: 'row',    
    justifyContent: 'center',
    height: 'auto',
    marginLeft: '2%'
  },
  
  grid: {
    
    display: 'flex',
    alignContent:'center',
    flexDirection: 'row',    
    justifyContent: 'center',
    height: 'auto',
  },
  form: {
    paddingTop: '2%',
    paddingBottom: '2%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
}));