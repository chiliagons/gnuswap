import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& > .fa": {
      margin: theme.spacing(2),
    },
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
  a: {
    textDecoration: "none",
  },
  text: {
    fontFamily: "Poppins",
  },
  supportcard: {
    borderRadius: "15px",
    paddingTop: "3px",
  },
  button: {
    textTransform: "capitalize",
    width: "10px",
  },

  input: {
    borderRadius: 4,
    backgroundColor: theme.palette.background.paper,
    color: "#008c73",
    border: "1px solid #ced4da",
    fontSize: 16,
    marginTop:10,
    marginBottom: 10,
    minWidth: "350px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },

  card: {
    borderRadius: "15px",
    maxHeight: "600px",
    width: "650px",
    display:"flex",
    flexDirection: "column",
  },

  grid: {
    display: "flex",
    justifyContent: "space-evenly",
  },

  formContentRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  formContentColumn: {
    display: "flex",
    flexDirection: "column",
  },
}));
